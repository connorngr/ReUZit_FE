import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../services/authService';

// Định nghĩa kiểu cho user
interface User {
    id: number;
    username: string;
    email: string;
}

// Định nghĩa kiểu cho state của auth
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Khởi tạo state ban đầu
const initialState: AuthState = {
    user: authService.getCurrentUser(),
    isAuthenticated: !!authService.getCurrentUser(),
    loading: false,
    error: null,
};

// Async action cho login
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const user = await authService.login(email, password);
            return { user };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

// Async action cho register
export const register = createAsyncThunk(
    'auth/register',
    async (
        { username, email, password }: { username: string; email: string; password: string },
        thunkAPI
    ) => {
        try {
            const response = await authService.register(username, email, password);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Register failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authService.logout();
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
