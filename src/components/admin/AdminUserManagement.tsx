import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {API_URL} from "../../api/listing.ts";
import { getToken } from '../../utils/storage';

interface Authority {
    authority: string;
}


interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    locked: boolean;
    enabled: boolean;
    authorities: Authority[];
}

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = getToken();
        try {
            const response = await axios.get<User[]>(`${API_URL}/api/admin/users`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log(response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const toggleUserLock = async (userId: number) => {
        const token = localStorage.getItem('jwt-token');
        try {
            const response = await axios.patch<User>(`${API_URL}/api/admin/users/${userId}/toggle-lock`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setUsers(users.map(user => user.id === userId ? response.data : user));
        } catch (error) {
            console.error('Error toggling user lock:', error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{`${user.firstName} ${user.lastName}`}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.locked ? 'Locked' : 'Active'}</td>
                        <td className="py-2 px-4 border-b">
                            <button
                                onClick={() => toggleUserLock(user.id)}
                                className={`px-4 py-2 rounded ${user.locked ? 'bg-green-500' : 'bg-red-500'} text-white`}
                            >
                                {user.locked ? 'Unlock' : 'Lock'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserManagement;