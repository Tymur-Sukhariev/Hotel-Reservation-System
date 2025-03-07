
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Review{
  id: number;
  user: {
    firstName: string;
    lastName: string;
    id: number;
  };
  text: string;
  rate: number;
  createdAt: string;
}


interface ReviewsState {
  items: Review[]; 
  offset: number;
  hasMore: boolean;
  loading: boolean;
}

const initialState: ReviewsState = {
  items: [],
  offset: 0,
  hasMore: true,
  loading: false,
};

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addReviews: (state, action: PayloadAction<Review[]>) => {
      state.items = [...state.items, ...action.payload];
      state.offset += action.payload.length;
      state.hasMore = action.payload.length === 5;
    },
    deleteStateReview: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(review => review.user.id !== action.payload);
    },
    addNewReview: (state, action: PayloadAction<Review>) => {
      state.items.unshift(action.payload);
    },
  },
});

export const { setLoading, addReviews, deleteStateReview, addNewReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;