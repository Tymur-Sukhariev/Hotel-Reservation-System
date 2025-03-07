
import { z, ZodError } from 'zod';
import { db } from '../db';
import bcrypt from 'bcrypt';
import { userSchema } from '../zod-schema';
import { EmailService } from './email-service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const SESSION_EXPIRY = 1000 * 60 * 60 * 24 ; // 1 day

export class AuthService{
    emailService = new EmailService()
    
    public async createNewUser(data: z.infer<typeof userSchema.create>) {
        try {
          const validatedData = userSchema.create.parse(data);
          
          const hashedPassword = await bcrypt.hash(validatedData.password, 10)
          const createdUser = await db.users.create({
            data: {
              firstName: validatedData.firstName,
              lastName: validatedData.lastName,
              email: validatedData.email,
              passwordHash: hashedPassword,
              role: 'USER'
            }
          });
          
          const session = await this.createSession(createdUser.email);
          return session.token
        } catch (err) {
          // Pass Zod validation errors up
          if (err instanceof ZodError) {
            throw err;
          }
          // Handle database errors
          if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
              // Unique constraint violation (probably email)
              throw new Error('Email already exists')
            }
          }
          throw err;
        }
      }
 
    public async loginUser({ email, password }: { email: string, password: string }) {
        const user = await db.users.findUnique({where: { email }})
        if (!user) throw new Error('User not found')
        const passwordMatch = await bcrypt.compare(password, user.passwordHash)
        if (!passwordMatch) throw new Error('Invalid password')
        return await this.createSession(email)  
      }

      
    public async getSession(sessionToken:string){
        const session = await db.sessions.findFirst({where:{token: sessionToken}, include:{user:true}});
        if(!session)return null;
        
        const latestDate = session.updatedAt || session.createdAt;

        if (new Date().getTime() - latestDate.getTime() > SESSION_EXPIRY){
            return null;
        }
        
        await db.sessions.update({where:{id: session.id}, data:{updatedAt: new Date()}});
        return session
    }

    public async deleteSession(sessionToken:string){
        await db.sessions.delete({where:{token: sessionToken}});
    }

    // forgot-password.tsx - send email.
    public async requestResetPasswordLink(email: string) { 
      const user = await db.users.findUnique({ where: { email } });
      if (!user) throw new Error("No account found with this email address.");
      const resetToken = await db.resetPasswordTokens.create({ data: { userId: user.id },});
      const linkToSend = `http://localhost:3000/auth/reset-password?token=${resetToken.token}`;
      this.emailService.sendResetLink({ to: user.email, link: linkToSend });
    }
    
    // reset-password.tsx - if such token and if < 1 hour.
      public async accessResetPasswordPage(token: string) {
        const foundToken = await db.resetPasswordTokens.findUnique({where: { token },include: { user: true }});
        if (!foundToken) throw new Error('Invalid reset token');
        const isTooOld = new Date().getTime() - foundToken.createdAt.getTime() > 1000 * 60 * 60;
        if (isTooOld) throw new Error('Token expired');
        return { email: foundToken.user.email, token: foundToken.token };
      }
    
    // reset-password.tsx - resets password.
      public async resetPassword(data: z.infer<typeof userSchema.resetPassword>){
        const validatedData = userSchema.resetPassword.parse(data);
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)
        await db.$transaction([
          db.users.update({where: { email: validatedData.email }, data: { passwordHash: hashedPassword }}),
          db.resetPasswordTokens.delete({where: { token: validatedData.token }})
        ]);
    }
    
    private async createSession(email:string){
        const user = await db.users.findUnique({where:{email}});
        if(!user)throw new Error('User not found');
        const session = await db.sessions.create({data:{user:{connect:{email}}}});
        return session;
    }
}
