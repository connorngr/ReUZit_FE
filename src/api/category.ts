import axios from 'axios';
import { API_URL } from './auth';

export interface Category {
    id: number;
    name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await axios.get<Category[]>(`${API_URL}/api/categories`);
        return response.data;
    } catch (err) {
        console.error('Error fetching categories', err);
        throw err;
    }
};
