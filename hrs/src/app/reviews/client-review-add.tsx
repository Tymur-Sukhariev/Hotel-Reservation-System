"use client"

import styles from '../../styles/reviews.module.css'
import crossIcon from '../../../public/images/cross.svg'
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import grayStar from '../../../public/images/grayStar.svg'
import orangeStar from '../../../public/images/orangeStar.svg'
import { toast } from 'react-hot-toast'
import { addReview, checkIfAlreadyReview, getSession, logoutUser } from '~/server/action';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/redux/store';  // Import typed dispatch
import { addNewReview } from '~/redux/reviewsSlice';

type eventType = React.MouseEvent<HTMLImageElement>;

const formActionsToast: object = {
    style: { background: '#f56949', color: '#fff', borderRadius: '12px', width: '250px' }
}

const MAX_TEXT: number = 400;

export default function ClientReviewAdd() {


    const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
    const [selectedStars, setSelectedStars] = useState(0);
    const [reviewText, setReviewText] = useState<string>('');
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const draft = localStorage.getItem("reviewDraft");
        if (draft) {
            setReviewText(draft);
            localStorage.removeItem("reviewDraft");
        }
    }, []);


    useEffect(() => {
        if (isCommentOpen && textAreaRef.current) textAreaRef.current.focus();
    }, [isCommentOpen]);

    function togleCommentWindow() {
        setIsCommentOpen(prev => !prev)
    }

    function handleStarHover(e: eventType) {
        const image = e.target as HTMLImageElement;

        const allSiblings = Array.from(image.parentElement!.children) as HTMLImageElement[];
        const currentIndex = allSiblings.indexOf(image);

        for (let i = 0; i <= currentIndex; i++) {
            allSiblings[i]!.src = orangeStar.src;
        }
        for (let i = currentIndex + 1; i < allSiblings.length; i++) {
            allSiblings[i]!.src = grayStar.src;
        }
    }

    function handleStarUnhover(e: eventType) {
        const image = e.target as HTMLImageElement;

        const allSiblings = Array.from(image.parentElement!.children) as HTMLImageElement[];
        const selectedIndex = selectedStars - 1;

        for (let i = 0; i < allSiblings.length; i++) {
            allSiblings[i]!.src = i <= selectedIndex ? orangeStar.src : grayStar.src;
        }
    }

    function handleStarClick(e: eventType) {
        const image = e.target as HTMLImageElement;

        const allSiblings = Array.from(image.parentElement!.children) as HTMLImageElement[];
        const currentIndex = allSiblings.indexOf(image);
        setSelectedStars(currentIndex + 1);
    }

    function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const text = e.target.value;
        (text.length <= MAX_TEXT) ? setReviewText(text) : toast.error("MAX 400 characters!");
    }

    const dispatch = useDispatch<AppDispatch>();

    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!reviewText.trim()) {
            toast('Review cannot be empty!', formActionsToast);
            return;
        }
        if (selectedStars === 0) {
            toast('Please rate with stars!', formActionsToast);
            return;
        }

        try {
            const session = await getSession();
            if (!session) {
                localStorage.setItem("reviewDraft", reviewText);
                await logoutUser();
            }

            const userId = session!.user.id;

            const ifHasReview = await checkIfAlreadyReview(userId);
            if (ifHasReview) {
                toast('Only one comment allowed!', formActionsToast);
                return;
            }

            const result = await addReview({ userId, rate: selectedStars, text: reviewText });
            const review = { ...result, user: result.user!, createdAt: new Date(result.createdAt).toISOString() };

            dispatch(addNewReview(review));
            console.log("Review from server:", result);
            setSelectedStars(0);
            setReviewText('');
            setIsCommentOpen(false);
            toast.success('Review was added!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    }




    return (
        <>
            {!isCommentOpen ?
                <button onClick={togleCommentWindow}>+ Leave your review</button>
                :
                <form onSubmit={handleFormSubmit} className={styles.openComment}>
                    <Image onClick={togleCommentWindow} width={20} height={20} src={crossIcon} alt="crossIcon" />
                    <textarea maxLength={MAX_TEXT + 1} onChange={handleTextChange} ref={textAreaRef} name="reviewText" value={reviewText} placeholder='Enter your review... '></textarea>

                    <div className={styles.actionsContainer}>
                        <div className={styles.starMenu}>
                            {Array.from({ length: 5 }, (_, i) =>
                            (<Image
                                key={i}
                                width={22}
                                height={22}
                                src={grayStar}
                                onClick={handleStarClick}
                                onMouseLeave={handleStarUnhover}
                                onMouseEnter={handleStarHover}
                                alt="starIcon" />
                            ))
                            }
                        </div>
                        <button type='submit'>Send</button>
                    </div>
                </form>
            }
        </>
    )
}