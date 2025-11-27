import Image from "next/image"
import AllFacilities from "~/components/AllFacilities";
import styles from '../../../styles/detailed.module.css'
import { getPrice } from "~/utils/getPrice";
import { getRoomDetails } from "~/server/services/detail-search-service";
import { redirect } from "next/navigation";
import { getSession, handleBooking, logoutUser } from "~/server/action";
import { cookies } from "next/headers";


type PageProps = {
    params: Promise<Record<string, string>>
    searchParams: Promise<Record<string, string>>;
}
export default async function DetailedPage({ params, searchParams }: PageProps) {

    const myParams = await params;
    const typeId = +(decodeURI(myParams.type_id ?? '0').trim());

    const search = await searchParams;
    const checkIn = search?.checkin ?? ""
    const checkOut = search?.checkout ?? ""
    const children = +(search?.children ?? 0)
    const isTV = search?.tv === 'true' || false;
    const isAC = search?.ac === 'true' || false;
    const isBath = search?.bath === 'true' || false;
    const facilitiesContainer = { isAC, isBath, isTV }

    const result = await getRoomDetails({
        typeId,
        facilities: {
            tv: isTV,
            ac: isAC,
            bath: isBath
        },
        checkIn,
        checkOut
    })
    // console.log("ROOM info", result);


    const finalPrice = getPrice(checkIn, checkOut, result.price, children);

    async function handleBook() {
        "use server"

        const session = await getSession();
        if (!session) await logoutUser();

        try {
            await handleBooking({
                userId: session!.userId,
                typeId,
                facilities: { isTV, isAC, isBath },
                checkIn,
                checkOut,
                totalPrice: finalPrice
            });
            (await cookies()).set('booking_success', 'true', { maxAge: 5 })
        }
        catch (error) {
            console.log(error);
            return
        }
        redirect('/');
    }

    return (
        <form action={handleBook} className={styles.allContainer}>
            <h1>{result.type} {result.comfort}</h1>
            <div className={styles.main}>
                <div>
                    <div className={styles.bigImg}>
                        <Image
                            src={`/images/rooms/${result.images[0]}`}
                            alt="room"
                            fill
                            priority
                        />
                    </div>
                    <div className={styles.smallImgContainer}>
                        {result.images
                            .filter((_, index) => index !== 0)
                            .map((image, index) => (
                                <div key={index} className={styles.eachSmallContainer}>
                                    <Image src={`/images/rooms/${image}`} alt="roomImg" fill />
                                </div>)
                            )}
                    </div>
                </div>

                <div>
                    <div className={styles.allFacilities}>
                        <AllFacilities {...facilitiesContainer} />
                    </div>
                    <div className={styles.bookContainer}>
                        <h1>Total: {finalPrice}€</h1>
                        {result.isAvailable && <button type="submit">BOOK</button>}
                        {!result.isAvailable && <button disabled className='pointer-events-none'>UNAVAILABLE NOW</button>}

                    </div>
                </div>
            </div>
            <p>{result.description}</p>
        </form>
    )
}