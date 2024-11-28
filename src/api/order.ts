import axios from 'axios';
import { API_URL, headers } from './auth';
import {Listing } from './listing'
import {User} from './user'
import {Address} from './address'

// interfaces/order.ts
export interface Order {
    id: number;
    user: User;
    listing: Listing;
    orderDate: string; // ISO 8601 string
    confirmationDate: string; 
    shippingAddress: Address;
  }
  export interface OrderCOD {
    listing: Listing;
    shippingAddress: Address;
  }

  // Create COD Order API function
export const createCodOrder = async (order: OrderCOD): Promise<Order> => {
  try {
    // Send POST request to backend to create COD order
    const response = await axios.post(`${API_URL}/api/payments/createCodOrder`, order, {
      headers: headers(),
    });
    return response.data; // The saved order with payment status PENDING
  } catch (error) {
    console.error('Error creating COD order:', error);
    throw error; // You can customize error handling as needed
  }
};

export const updateOrderStatus = async (id: number, status: 'SOLD' | 'ACTIVE' | 'INACTIVE', transactionId: number): Promise<Order> => {
    const response = await axios.put(`${API_URL}/api/orders/${id}/status`, null, {
      headers: headers() ,
      params: { status, transactionId },
    });
    return response.data;
  };

export const getAllOrdersByUser = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/api/orders/user`, {
    headers: headers(),
  });
  return response.data;
};
  