'use server'

import { z, ZodError } from "zod"
import { AuthService } from "./services/auth-service"
import { userSchema } from "./zod-schema"
import { cookies } from "next/headers"
import { searchRooms } from './services/search-service'
import { redirect } from "next/navigation"
import { BookingService } from "./services/book-service"
import { MyBookingsService, type QueryType } from "./services/my-bookings"
import { revalidatePath } from "next/cache"
import { ReviewService } from "./services/review-service"


export const createNewUser = async (data: z.infer<typeof userSchema.create>) => {
  try {
    const token = await new AuthService().createNewUser(data)
    const cooks = await cookies()
    cooks.set('sessionToken', token)
    return [null, token] as const
  }
  catch (err) {
    if (err instanceof ZodError) {
      // Pass validation errors back to client
      return [err, null] as const
    }
    if (err instanceof Error && err.message === 'Email already exists') {
      return [err, null] as const
    }
    // Handle other errors (database, etc)
    return [new Error('Failed to create user'), null] as const
  }
}

export const loginUser = async (data: z.infer<typeof userSchema.login>) => {
  try {
    const session = await new AuthService().loginUser(data)
    const cooks = await cookies()
    cooks.set('sessionToken', session.token)
    return [null, session]
  }
  catch (err) {
    return [err instanceof Error ? err : new Error('Failed to login'), null];
  }
}

export const logoutUser = async () => {
  const cooks = await cookies();
  const token = cooks.get('sessionToken');
  if (!token) return redirect('/auth/sign-in');

  await new AuthService().deleteSession(token.value);
  cooks.delete('sessionToken');
  return redirect('/auth/sign-in');
}

export const getSession = async () => {
  const cooks = await cookies()
  const token = cooks.get('sessionToken')
  if (!token) return null
  return await new AuthService().getSession(token.value)
}

export const requestPasswordReset = async (email: string) => {
  try {
    await new AuthService().requestResetPasswordLink(email);
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to request password reset link.");
    }
    throw new Error("An unexpected error occurred while requesting password reset link.");
  }
};

export const hasValidResetToken = async (token: string) => {
  try {
    return await new AuthService().accessResetPasswordPage(token);
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Invalid or expired token.");
    }
    throw new Error("An unexpected error occurred while validating the reset token.");
  }
};

export const resetPassword = async (data: z.infer<typeof userSchema.resetPassword>) => {
  try {
    return await new AuthService().resetPassword(data);
  }
  catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to reset password.");
    }
    throw new Error("An unexpected error occurred while resetting the password.");
  }
};

export const roomSearchAction = async (
  checkIn: string,
  checkOut: string,
  guests: number,
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    selectedFacilities?: {
      tv: boolean;
      ac: boolean;
      bath: boolean;
    };
    selectedRoomType?: string | null;
  }
) => {
  console.log(await searchRooms(checkIn, checkOut, guests, filters));

  return await searchRooms(checkIn, checkOut, guests, filters);
};

export async function handleBooking({
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
  if (!userId) throw new Error('User ID is required');

  try {
    const booking = await new BookingService().createBooking({
      userId,
      typeId,
      facilities,
      checkIn,
      checkOut,
      totalPrice
    });
    return booking;
  } catch (error) {
    throw new Error('Booking failed: ' + (error as Error).message);
  }
}

export const getBookings = async ({ userId, bookingNumber }: QueryType) => {
  const bookings = await new MyBookingsService().getBookings({ userId, bookingNumber })
  return bookings;
}

export const cancelBooking = async (bookingNumber: number) => {
  await new MyBookingsService().cancelBooking(bookingNumber)
  revalidatePath('/my-bookings')
}

export const addReview = async ({ userId, rate, text }: { userId: number, rate: number, text: string }) => {
  const addedReview = await new ReviewService().addReview({ userId, rate, text });
  revalidatePath('/reviews')
  return addedReview;
}

export const checkIfAlreadyReview = async (userId: number) => {
  return await new ReviewService().checkIfAlreadyReview(userId);
}

export const getReviews = async (offset: number) => {
  const reviews = await new ReviewService().getReviews(offset);
  return reviews;
}

export const getRating = async () => {
  const rating = await new ReviewService().getAverageRating();
  return rating;
}

export const deleteReview = async (userId: number) => {
  await new ReviewService().deleteReview(userId);
  revalidatePath('/reviews')
}

export const numberOfReviews = async () => {
  const res = await new ReviewService().numberOfReviews();
  return res;
}

