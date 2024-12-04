import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import listingReducer from './listingSlice';
import chatReducer from './chatSlice';

// Khởi tạo Redux store
export const store = configureStore({
    reducer: {
        auth: authReducer,
        listings: listingReducer,
        chat: chatReducer,
    },
});

// Định nghĩa RootState (kiểu của state trong Redux Store)
export type RootState = ReturnType<typeof store.getState>;

// Định nghĩa AppDispatch (kiểu của dispatch trong Redux Store)
export type AppDispatch = typeof store.dispatch;

export default store;
