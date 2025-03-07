import { configureStore } from '@reduxjs/toolkit'
import { reviewsSlice } from './reviewsSlice'

export const store = configureStore({
  reducer: {
    reviews: reviewsSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch