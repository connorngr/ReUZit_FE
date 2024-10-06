import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/authenticate`, {
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
        const response = await axios.post(`${API_URL}/auth/register`, {
            firstname,
            lastname,
            email,
            password
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}