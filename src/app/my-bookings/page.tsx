import Booking from '~/components/Booking'
import styles from '../../styles/myBookings.module.css'
import { getBookings, getSession, logoutUser } from '~/server/action'
import Link from 'next/link';


export default async function MyBookings(){

    const session = await getSession();
    if(!session) await logoutUser();

    const userId = session!.userId;
    const bookings = await getBookings({userId})

    const hasBookings = bookings.length>0;

    return(
        <div className={styles.bookingsContainer}>
            {hasBookings? 
            <h1>My Bookings</h1>
            : 
            <div className={styles.noBookings}>
                <h1>No bookings yet</h1>
                <p>You are always free to book your room!</p>
                <Link href='/'>Book!</Link>
            </div>
            }

            {bookings.map((booking, index)=>(<Booking key={index} {...booking}/>))}
        </div>
    )
}