import axios from 'axios';
import { getToken } from '../utils/storage';
import { API_URL, headers } from './auth';
import {Listing } from './listing'
import {User} from './user'

// interfaces/order.ts
export interface Order {
    id: number;
    user: User;
    listing: Listing;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    orderDate: string; // ISO 8601 string
    confirmationDate: string; // ISO 8601 string
    amount: number;
  }

export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  const response = await axios.post(`${API_URL}/api/orders`, order, {
    headers: headers(),
  });
  return response.data;
};

export const updateOrderStatus = async (id: number, status: 'PENDING' | 'COMPLETED' | 'CANCELED'): Promise<Order> => {
    const response = await axios.put(`${API_URL}/api/orders/${id}/status`, null, {
      headers: headers() ,
      params: { status },
    });
    return response.data;
  };

export const getAllOrdersByUser = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/api/orders/user`, {
    headers: headers(),
  });
  return response.data;
};
  