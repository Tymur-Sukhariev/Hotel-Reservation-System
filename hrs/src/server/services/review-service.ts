import { db } from "../db";

const MAX_BOOKING_INTERVAL = 1000 * 60 * 60 * 24 * 180; // 180 days

export class ReviewService {

    public async addReview({ userId, rate, text }: { userId: number, rate: number, text: string }) {
        if (rate < 1 || rate > 5) throw new Error('Invalid stars!');
        if (!text.trim()) throw new Error('Invalid review text!');

        // const reviews = await db.reviews.findMany({where:{userId}});
        // if(reviews.length>0)throw new Error('You already have a review!');

        // const userBookings = await db.bookings.findMany({where:{userId}});
        // if(userBookings.length===0)throw new Error("You don't have booking!");

        // const now = new Date().getTime();
        // const isEligible = userBookings.some(
        //     booking => now - booking.checkOut.getTime() < MAX_BOOKING_INTERVAL
        // );

        // if (!isEligible) throw new Error("It's been more than 180 days since your last booking!");

        const addedReview = await db.reviews.create({ data: { userId, rate, text } })

        const user = await db.users.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, id: true }
        })

        return { ...addedReview, user }

    }

    public async checkIfAlreadyReview(userId: number) {
        const reviewList = await db.reviews.findMany({ where: { userId } })
        return reviewList.length === 1 ? true : false;
    }

    public async getReviews(offset: number = 0) {
        const reviews = await db.reviews.findMany({
            skip: offset,
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, firstName: true, lastName: true } } }
        });
        return reviews;
    }

    public async getAverageRating() {
        const result = await db.reviews.aggregate({ _avg: { rate: true } });
        return result._avg.rate ? parseFloat(result._avg.rate.toFixed(1)) : 0;
    }

    public async deleteReview(userId: number) {
        await db.reviews.deleteMany({ where: { userId: userId }, });
    }
    public async numberOfReviews() {
        const res = await db.reviews.findMany();
        return res.length;
    }
}