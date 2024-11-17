import axios from 'axios';
import { getToken } from '../utils/storage';
import { API_URL } from './auth';

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
