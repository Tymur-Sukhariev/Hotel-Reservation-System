import { db } from "../db";
import { Prisma } from "@prisma/client";

export type QueryType = {
  userId?: number;
  bookingNumber?: number;
};

export type BookingResponse = {
  type: string;
  typeImg: string;
  person: string;
  email: string;
  dates: {
    checkIn: string;
    checkOut: string;
  };
  total: number;
  bookingNumber: number;
};

export class MyBookingsService {
    
  public async getBookings({ userId, bookingNumber }: QueryType): Promise<BookingResponse[]> {

    const where: Prisma.BookingsWhereInput = {};
    if (userId) where.userId = userId;
    if (bookingNumber) where.bookingNumber = bookingNumber;
    const now = new Date();
    const ltTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Vilnius' }));
    const isBeforeCheckout = ltTime.getHours() < 12;
    const todayNoon = new Date(ltTime);
    todayNoon.setHours(12, 0, 0, 0);
    where.OR = [{checkOut: {gt: ltTime}}];

    if (isBeforeCheckout) {
      where.OR.push({
        checkOut: {
          gte: new Date(ltTime.setHours(0, 0, 0, 0)), 
          lt: todayNoon 
        }
      });
    }

    const bookings = await db.bookings.findMany({
      where,
      select: {
        bookingNumber: true,
        totalPrice: true,
        checkIn: true,
        checkOut: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        room: {
          select: {
            type: {
              select: {
                type: true,
                comfort: true,
                images: {
                  where: {
                    NOT: {
                      imageUrl: { contains: 'universal' }
                    }
                  },
                  take: 1,
                  select: {
                    imageUrl: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!bookings.length) return [];

    return bookings.map(booking => ({
      type: `${booking.room.type.type} ${booking.room.type.comfort}`,
      typeImg: booking.room.type.images[0]?.imageUrl ?? '',
      person: `${booking.user.firstName} ${booking.user.lastName}`,
      email: booking.user.email,
      dates: {
        checkIn: new Date(booking.checkIn).toLocaleDateString('de-DE'),
        checkOut: new Date(booking.checkOut).toLocaleDateString('de-DE')
      },
      total: booking.totalPrice,
      bookingNumber: booking.bookingNumber
    }));
  }

  public async cancelBooking(bookingNumber: number){
    await db.bookings.delete({where: {bookingNumber}})
  }
}