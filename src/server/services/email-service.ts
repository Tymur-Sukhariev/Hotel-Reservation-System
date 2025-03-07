import * as postmark from "postmark";
import * as nodeMailer from "nodemailer";
import { env } from "~/env";

type MailOptions = {
    from: string,
    to: string,
    subject: string,
    text: string
}

export class EmailService{
    defaultFrom = env.GMAIL_USER;
    transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.GMAIL_USER,
          pass: env.GMAIL_PASSWORD
        }
      });
    
    public sendEmail(options: MailOptions){
        this.transporter.sendMail({...options, from:options.from ?? this.defaultFrom}, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }

    public sendResetLink({to, link}: {to:string, link:string}){
      this.sendEmail({
        from: this.defaultFrom,
        to: to,
        subject: "Password Reset",
        text: link
      })
    }


    public sendBookingConfirmation({
    to,
    firstName,
    bookingNumber,
    roomType,
    checkIn,
    checkOut,
    totalPrice
  }: {
    to: string;
    firstName: string;
    bookingNumber: number;
    roomType: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
  }) {
    this.sendEmail({
      to,
      subject: 'Booking Confirmation',
      text: `
        Dear ${firstName},
        
        Your booking in HOTEL has been confirmed!
        Booking Number: ${bookingNumber}
        Room Type: ${roomType}
        Check-in: ${checkIn}
        Check-out: ${checkOut}
        Total Price: €${totalPrice}
        
        Thank you for choosing our service!
      `,
      from: this.defaultFrom
    });
    }
}