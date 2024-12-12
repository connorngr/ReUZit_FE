import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

// Định nghĩa kiểu Listing
interface Listing {
    id: number;
    title: string;
    description: string;
    images: string[];
    price: number;
    userId: number;
    username: string;
    createdAt: string;
    updatedAt: string;
    categoryName: string;
    condition: string;
    status: string;
}

// Định nghĩa kiểu state cho Listing
interface ListingState {
    listings: Listing[];
    selectedListing: Listing | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

// Khởi tạo state ban đầu
const initialState: ListingState = {
    listings: [],
    selectedListing: null,
    loading: false,
    error: null,
    success: false,
};

// Async action fetchListings
export const fetchListings = createAsyncThunk(
    'listings/fetchListings',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/listings');
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
        }
    }
);

// Async action fetchListingById
export const fetchListingById = createAsyncThunk(
    'listings/fetchListingById',
    async (id: number, thunkAPI) => {
        try {
            const response = await api.get(`/listings/${id}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
        }
    }
);

// Async action addListing
export const addListing = createAsyncThunk(
    'listings/addListing',
    async (formData: { title: string; description: string; images: File[] }, thunkAPI) => {
        try {
            const form = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key !== 'images') {
                    form.append(key, formData[key as keyof typeof formData] as string);
                }
            });

            formData.images.forEach((image) => {
                form.append('images', image);
            });

            const response = await api.post('/listings', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Add listing failed');
        }
    }
);

const listingSlice = createSlice({
    name: 'listings',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchListings.fulfilled, (state, action: PayloadAction<Listing[]>) => {
                state.loading = false;
                state.listings = action.payload;
            })
            .addCase(fetchListings.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchListingById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchListingById.fulfilled, (state, action: PayloadAction<Listing>) => {
                state.loading = false;
                state.selectedListing = action.payload;
            })
            .addCase(fetchListingById.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addListing.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addListing.fulfilled, (state, action: PayloadAction<Listing>) => {
                state.loading = false;
                state.listings.unshift(action.payload);
                state.success = true;
            })
            .addCase(addListing.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to add listing';
                state.success = false;
            });
    },
});

export const { clearError, clearSuccess } = listingSlice.actions;

export default listingSlice.reducer;
