import Image from "next/image"
import avatar from '../../public/images/avatar.svg'
import styles from '../styles/reviewItem.module.css'
import grayStar from '../../public/images/grayStar.svg'
import orangeStar from '../../public/images/orangeStar.svg'
import { dateOnTimeZone } from "~/utils/determineDay"
import DeleteButton from "./DeleteButton"
import { useEffect, useState } from "react"
import { getSession } from "~/server/action"

type ReviewProps = {
    user: { firstName: string; lastName: string; id: number };
    text: string,
    rate: number,
    createdAt: string,
}

export default function Review({ user, text, rate, createdAt}:ReviewProps){

    const [nowUserId, setNowUserId] = useState<number>(0);

    async function getCurrentUserId(){
        const session = await getSession(); 
        const currentUserId = session?.user?.id; 
        if(currentUserId)setNowUserId(currentUserId)
    }

    useEffect(()=>{
        getCurrentUserId()
    }, [])

    const author = nowUserId === user.id ? "You" : `${user.firstName} ${user.lastName}`;
    const isDeleteBtn = author === "You";
    const reviewDate = dateOnTimeZone(createdAt);


    return(
        <div className={styles.review}>
            <Image src={avatar} alt="avatarIcon"/>
            <div>
                <div className={styles.reviewInfo}>
                    <h2>{author}</h2>
                    <CalculateStars rate={rate}/>
                    <time>{reviewDate}</time>

                    {isDeleteBtn&&<DeleteButton user={user.id}/>}
                </div>
                <p>{text}</p>
            </div>
        </div>
    )
}

function CalculateStars({rate}:{rate:number}) {
    return (
        <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
                <Image  
                    key={i} 
                    width={20}
                    height={20}
                    src={i + 1 <= rate ? orangeStar : grayStar}  
                    alt="starIcon"
                />
            ))}
        </div>)
}
