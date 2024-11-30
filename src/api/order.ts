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

export const createCodOrder = async (
  idListing: number,
  idAddress: number
): Promise<Order> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/createCodOrder`,
      null, // No body required since we're using query parameters
      {
        headers: headers(),
        params: { idListing, idAddress },
      }
    );
    return response.data; // Return the Order object from the response
  } catch (error: any) {
    console.error('Error creating COD order:', error.response?.data || error.message);
    throw error;
  }
};
  