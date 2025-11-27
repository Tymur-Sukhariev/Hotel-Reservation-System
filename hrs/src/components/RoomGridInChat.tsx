import { RoomOption } from "./Chat";
import styles from '../styles/chat.module.css'
import Image from "next/image"

export default function RoomGrid({ roomOptions }: { roomOptions: RoomOption[] }) {
    return <div className={styles.roomGrid}>
        {roomOptions.map((room, idx) => {
            return (
                <div key={idx}>
                    <p className={styles.optionLabel}>Option {idx + 1}</p>
                    <div className={styles.roomContent}>
                        <div className={styles.roomImageWrapper}>
                            <Image
                                src={`/images/rooms/${room.img}`}  // adjust path to your setup
                                alt={`${room.type} ${room.comfort}`}
                                width={200}
                                height={140}
                                className={styles.roomImage}
                            />
                        </div>
                        <div className={styles.roomInfo}>
                            <h3>{room.type} – {room.comfort}</h3>
                            <p className={styles.roomText}>{room.prevText}</p>
                            {(room.facilities.tv || room.facilities.ac || room.facilities.bath) && (
                                <ul className={styles.facilities}>
                                    {room.facilities.tv && <li>TV</li>}
                                    {room.facilities.ac && <li>AC</li>}
                                    {room.facilities.bath && <li>Bath</li>}
                                </ul>
                            )}

                            <p className={styles.price}>€{room.price}</p>
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
}
