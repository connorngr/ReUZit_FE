import api from './api';

interface User {
    id: number;
    username: string;
    email: string;
    token?: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

// Đăng nhập
export const login = async (email: string, password: string): Promise<User> => {
    const response = await api.post<LoginResponse>('/auth/authenticate', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    }
    throw new Error('Invalid login response');
};

// Đăng ký
export const register = async (username: string, email: string, password: string): Promise<void> => {
    await api.post('/auth/register', { username, email, password });
};

// Đăng xuất
export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Lấy user hiện tại
export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};
