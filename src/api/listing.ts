import axios from 'axios';
import { getToken } from '../utils/storage';

// Define the base URL of your API
export const API_URL = import.meta.env.VITE_API_URL;

// Define the response type
export interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    condition: string;
    categoryId: number;
    status: string;
    images: Image[];
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    id: number;
    url: string;
}

// Fetch all listings
export const fetchListings = async (): Promise<Listing[]> => {
    try {
        const response = await axios.get<Listing[]>(`${API_URL}/api/listings`);
        console.log('Fetched listings:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching listings', error);
        throw error;
    }
};

// Create a new listing
export const createListing = async (listingData: FormData): Promise<Listing> => {
    // Log the listing data for debugging purposes
    const token = getToken();
    try {
        const response = await axios.post<Listing>(`${API_URL}/api/listings`, listingData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });

        console.log('Created listing:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error creating listing', error);
        throw error;
    }
};