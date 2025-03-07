"use client"
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import { setLoading, addReviews } from '~/redux/reviewsSlice';
import { getReviews } from "~/server/action";
import Review from "~/components/Review";


const LIMIT = 5;

export default function ClientList() {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, hasMore, offset } = useSelector((state: RootState) => state.reviews);

    const fetchReviews = useCallback(async () => {
      if (loading) return;
      
      dispatch(setLoading(true));
      try {
        const newReviews = await getReviews(offset);

        dispatch(addReviews(newReviews.map(review => ({
          ...review,
          createdAt: new Date(review.createdAt).toISOString()

        }))));
      } catch (error) {
        console.error("Error loading reviews:", error);
      } 
      dispatch(setLoading(false));
      
    }, [dispatch, loading, offset]);
  
    useEffect(() => {
      fetchReviews();
    }, []);

    return (
        <>
            {items.map((review, index) => (
                <Review
                    key={index}
                    {...review}
                    createdAt={new Date(review.createdAt).toISOString()}
                />
            ))}
            {hasMore && (
                <button onClick={fetchReviews} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                </button>
            )}
        </>
    );
}
