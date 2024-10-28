import axios from "axios";
import { API_URL } from "./listing";


export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/authenticate`, {
            email,
            password
        });
        return response;
    } catch (error: any) {
        // If there's an error (like 401 Unauthorized), we can handle it here
        if (error.response) {
            // Re-throw the error with the response information
            throw error.response;
        } else {
            throw new Error('Network error or server unavailable');
        }
    }
}

export const signup = async (firstname: string, lastname: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            firstname,
            lastname,
            email,
            password
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
}

export const getListings = async () => {
    try {
        console.log('Calling API:', `${API_URL}/listings`);
        const response = await axios.get(`${API_URL}/listings`);
        console.log('Data fetched from API:', response.data); // Kiểm tra dữ liệu trả về
        return response.data;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
};
