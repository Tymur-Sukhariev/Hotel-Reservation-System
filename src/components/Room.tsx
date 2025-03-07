import styles from '../styles/room.module.css'
import Image from 'next/image';
import { FC } from 'react';
import Facility from './Facility';
import Link from 'next/link';

type Room = {
    typeId: number;
    type: string;
    comfort: string;
    price: number;
    facilities: {
      tv: boolean;
      ac: boolean;
      bath: boolean;
    };
    img: string;
    prevText: string;
    checkIn: string;
    checkOut: string;
    children: number;
}

function Room({typeId, img, type, comfort, prevText, price, facilities, checkIn, checkOut, children}:Room){

    const isTV = facilities.tv?true:false;
    const isAC = facilities.ac?true:false;
    const isBath = facilities.bath?true:false;

    const detailedPageLink = 
    `/search-results/${typeId}
    ?checkin=${checkIn}&checkout=${checkOut}&children=${children}&tv=${isTV}&ac=${isAC}&bath=${isBath}`;

    return(
        <div className={styles.room}>

             <div className={styles.imgContainer}>
                 <Image src={`/images/rooms/${img}`}  width={565} height={565} alt='roomImg'/>
             </div>

            <div className={styles.infoContainer}>
                <h1>{`${type} ${comfort}`}</h1>
                <p>{prevText}</p>
                <p>€{price}</p>
                <div>
                    <Facility facility={"WI-FI"}/>                
                    {isTV&&<Facility facility={"TV"}/>}
                    {isBath&&<Facility facility={"Bath"}/>}
                    {isAC&&<Facility facility={"AC"}/>}
                
                </div>

                <Link href={detailedPageLink}>CHECK & BOOK</Link>
            </div>

        </div>
    )
}

export default Room;