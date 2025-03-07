import { z } from 'zod';

export const userSchema = {
    create: z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        passwordAgain: z.string().min(6),
    }).refine(data => data.password === data.passwordAgain, {
        message: 'Passwords do not match',
    }),
    update: z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
    }).partial(),
    login: z.object({
        email: z.string().email(),
        password: z.string().min(6),
    }),
    resetPassword: z.object({
        email: z.string().email(),
        token: z.string(),
        password: z.string().min(6),
        passwordAgain: z.string().min(6),
    }).refine(data => data.password === data.passwordAgain, {
        message: 'Passwords do not match',
    }),
    
}