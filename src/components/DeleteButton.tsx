"use client"

import { toast } from 'react-hot-toast'
import { deleteReview } from '~/server/action'

import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/redux/store';
import { deleteStateReview } from '~/redux/reviewsSlice';

export default function DeleteButton({user}:{user:number}){
    const dispatch = useDispatch<AppDispatch>();
 
    async function handleDelete(){
        try{
            await deleteReview(user)
            dispatch(deleteStateReview(user));
            toast.success("Review deleted!")
        }catch(error){
            toast.error('An unexpected error occurred');
        }

    }
    return(
        <div className="flex">
            <span className="text-[#7E7E7E] mr-[7px]">|</span>
            <button onClick={handleDelete} className="text-[#F15B6C]" type="submit">Delete</button>
        </div>
    )
}
