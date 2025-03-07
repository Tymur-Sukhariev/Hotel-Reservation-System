import { db } from "~/server/db";
import { EmailService } from "./email-service";

export class BookingService {
  private generateBookingNumber(): number {
    return Math.floor(10000000 + Math.random() * 90000000);
  }

  async createBooking({
    userId,
    typeId,
    facilities,
    checkIn,
    checkOut,
    totalPrice
  }: {
    userId: number;
    typeId: number;
    facilities: { isTV: boolean; isAC: boolean; isBath: boolean };
    checkIn: string;
    checkOut: string;
    totalPrice: number;
  }) {
    const roomType = await db.types.findUnique({
      where: { id: typeId }
    });
    if (!roomType) throw new Error('Room type not found');

    const room = await db.rooms.findFirst({
      where: {
        typeId,
        facilities: {
          tv: facilities.isTV,
          ac: facilities.isAC,
          bath: facilities.isBath
        }
      },
      orderBy: {
        booked: 'asc'
      }
    });

    if (!room) throw new Error('No matching room found');

    const booking = await db.$transaction([
      db.bookings.create({
        data: {
          userId,
          bookingNumber: this.generateBookingNumber(),
          roomId: room.id,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          totalPrice
        }
      }),
      db.rooms.update({
        where: { id: room.id },
        data: { booked: { increment: 1 } }
      })
    ]);

    const user = await db.users.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const emailService = new EmailService();
    emailService.sendBookingConfirmation({
      to: user.email,
      firstName: user.firstName,
      bookingNumber: booking[0].bookingNumber,
      roomType: `${roomType.type} ${roomType.comfort}`,
      checkIn,
      checkOut,
      totalPrice
    });

    return booking[0];
  }
}