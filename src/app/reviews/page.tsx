import { getRating, getSession, numberOfReviews} from '~/server/action';
import styles from '../../styles/reviews.module.css'
import ClientReviewAdd from "./client-review-add";
import orangeStar from '../../../public/images/orangeStar.svg'
import Image from 'next/image';
import ClientList from './client-list';


export default async function Reviews(){
    const reviewsNumber = await numberOfReviews();
    const rating = await getRating();
 
    return(
        <div className={styles.reviewsContainer}>
            <h1>{reviewsNumber} Reviews</h1>
            <hr />

            <ClientReviewAdd/>
            <RatingBox rating={rating}/>
            <ClientList/>
       </div>
    )
}

function RatingBox({rating}:{rating:number}){
    return(
        <div className={styles.ratingBox}>
            <h3>Rating: {rating}</h3>
            <Image src={orangeStar} alt="ratingIcon"/>
        </div>
    )
}


            
