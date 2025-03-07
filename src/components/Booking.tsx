"use client"
import { cancelBooking } from '~/server/action';
import styles from '../styles/myBookings.module.css'
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-hot-toast'

type Booking = {
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

export default function Booking({type, person, typeImg, email, dates, total, bookingNumber}: Booking) {
  const [isWindowOpen, setIsWindowOpen] = useState<boolean>(false);

  function handleOpenClose() {
    setIsWindowOpen((prev) => (!prev));
  }

  async function handleCancelBooking() {
    handleOpenClose();
    await cancelBooking(bookingNumber);
    toast.success("Booking was canceled!")
  }

  return (
    <>
      {isWindowOpen && (
        <div className={styles.cancelWindow}>
            <div>
                <p>Cancel booking? It is NOT refundable!</p>
                <div className={styles.btnContainer}>
                    <button onClick={handleCancelBooking}>Yes</button>
                    <button onClick={handleOpenClose}>No</button>
                </div>
            </div>
        </div>
      )}
      <div className={styles.bookItem}>
        <Image width={300} height={300} src={`/images/rooms/${typeImg}`} alt="roomImg"/>
        <div>
          <h1>{type}</h1>
          <p>{person}</p>
          <p>{email}</p>
          <div className='mb-[5px]'>
            <time>{dates.checkIn}</time>
            <span className='mx-[5px] text-[#646464]'>-</span>
            <time>{dates.checkOut}</time>
          </div>
          <p>Total: €{total}</p>
          <p>Booking number: <span className='text-[#525AFC]'>{bookingNumber}</span></p>
          <button onClick={handleOpenClose} type='button'>Cancel booking</button>
        </div>
      </div>
    </>
  );
}