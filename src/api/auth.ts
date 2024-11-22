import axios from "axios";
import { getToken } from '../utils/storage';

export const API_URL = import.meta.env.VITE_API_URL;

export const headers = () => ({
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  });

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

export const signup = async (firstName: string, lastName: string, email: string, password: string, imageUrl: File | null) => {

    // Tạo đối tượng JSON cho thông tin người dùng
    const data = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password
    };

    const formData = new FormData();
    formData.append("user", JSON.stringify(data)); // Thêm JSON vào FormData với tên "user"

    if (imageUrl) {
        formData.append("imageUrl", imageUrl); // Thêm file ảnh
    }

    try {
        // Gửi yêu cầu API mà không đặt 'Content-Type'
        const response = await axios.post(`${API_URL}/api/auth/register`, formData);

        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        console.error('Error during signup:', error);
        throw new Error('Signup failed, please try again.');
    }
};



