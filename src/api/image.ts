import axios from 'axios';
import { getToken } from '../utils/storage';
import { API_URL } from './auth';

export interface Image {
    id: number;
    url: string;
}

export const addImages = async (listingId: number, files: File[]): Promise<Image[]> => {
    const token = getToken();
    const formData = new FormData();

    formData.append('listingId', listingId.toString());
    files.forEach((file) => formData.append('files', file));

    try {
        const response = await axios.post<Image[]>(`${API_URL}/api/images/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });

        console.log('Added images:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding images:', error);
        throw error;
    }
};

export const deleteImages = async (ids: number[]): Promise<string> => {
    const token = getToken();

    try {
        const response = await axios.delete<string>(`${API_URL}/api/images/delete`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: ids, // Send IDs in the request body
        });

        console.log('Deleted images:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting images:', error);
        throw error;
    }
};

export const getAllImagesByListingId = async (listingId: number): Promise<Image[]> => {
    const token = getToken();

    try {
        const response = await axios.get<Image[]>(`${API_URL}/api/images/list/${listingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        console.log('Fetched images:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
};
