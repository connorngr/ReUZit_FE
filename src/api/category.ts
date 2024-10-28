import axios from 'axios';
import { getToken } from '../utils/storage';

export const API_URL = import.meta.env.VITE_API_URL;

export interface Category {
    id: number;
    name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const token = getToken(); 

        const response = await axios.get<Category[]>(`${API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        return response.data;
    } catch (err) {
        console.error('Error fetching categories', err);
        throw err;
    }
};
