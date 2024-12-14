// userService.ts
import axios from 'axios';
import { getToken } from '../utils/storage'; // Giả sử bạn có một hàm để lấy token
import { API_URL } from './auth';
import {Authority} from './wishlist'
// User interface
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    listings: any[]; // Nếu biết chi tiết kiểu của listings, thay any[] bằng kiểu cụ thể
    imageUrl: string;
    role: string;
    bio: string;
    locked: boolean;
    money: number | null;
    authorities: Authority[];
    username: string;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    roles: string;
    enabled: boolean;
  }

// Hàm gọi API để lấy thông tin người dùng hiện tại
export const getCurrentUser = async (): Promise<User> => {
    try {
        const token = getToken(); // Lấy token từ local storage hoặc context
        const response = await axios.get<User>(`${API_URL}/api/users/current`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Thêm token vào header nếu cần
            },
        });

        return response.data; // Trả về giá trị User
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Ném lỗi để xử lý sau này nếu cần
    }
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
    try {
        const token = getToken(); // Lấy token từ local storage hoặc context
        const response = await axios.put<User>(
            `${API_URL}/api/users/update`, 
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                    'Content-Type': 'application/json', // Đảm bảo kiểu dữ liệu JSON
                },
            }
        );

        return response.data; // Trả về dữ liệu người dùng đã cập nhật
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error; // Ném lỗi để xử lý sau này
    }
};

export const updateUserImage = async (
    file: File
): Promise<User> => {
    try {
        const token = getToken(); // Lấy token từ local storage hoặc context

        // Tạo form data để gửi file
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.put<User>(
            `${API_URL}/api/users/image`, // Endpoint cập nhật ảnh
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                    'Content-Type': 'multipart/form-data', // Đảm bảo kiểu dữ liệu form-data
                },
            }
        );

        return response.data; // Trả về dữ liệu người dùng đã cập nhật
    } catch (error) {
        console.error('Error updating user image:', error);
        throw error; // Ném lỗi để xử lý sau
    }
};

export const fetchUsers = async () => {
    const token = getToken();
    try {
        const response = await axios.get<User[]>(`${API_URL}/api/admin/users`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
};

export const toggleUserLock = async (userId: number): Promise<User> => {
    const token = getToken();  // Ensure the token is being retrieved
    try {
        const response = await axios.patch<User>(`${API_URL}/api/admin/users/${userId}/toggle-lock`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        console.log('API Response:', response);  // Log the API response to check if it's correct
        return response.data;
    } catch (error) {
        console.error('Error toggling user lock:', error);
        throw error; 
    }
};

export const getUserById = async (id: number): Promise<User> => {
    try {
        const token = getToken(); // Lấy token từ local storage hoặc context
        const response = await axios.get<User>(`${API_URL}/api/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        });

        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error; // Ném lỗi để xử lý sau này
    }
};


