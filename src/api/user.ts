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
