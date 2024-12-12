import axios from 'axios';
import { API_URL, headers } from './auth';
import { Order } from './order'
export interface Payment {
  id: number;
  order: Order;
  status: 'PENDING' | 'SUCCESS' | 'FAILED'; // Enum PaymentStatus
  method: 'COD' | 'BANK_TRANSFER' | 'MOMO'; // Enum PaymentMethod
  transactionId: string;
  paymentDate: string; // ISO 8601 Date String
}


export const getPayment = async (price: number, idListing: number, idAddress: number): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/api/payments/pay`, {
      params: {
        price,
        idListing,
        idAddress,
      },
      headers: headers(),
      responseType: 'text', // API trả về plain text
    });
    return response.data; // URL để chuyển hướng
  } catch (error) {
    throw error;
  }
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

export const handleCoinWeb = async (
  idListing: number,
  idAddress: number
): Promise<Order> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/createCoinOrder`,
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

export const getDeposit = async (price: number): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/api/payments/deposit`, {
      params: {
        price
      },
      headers: headers(),
      responseType: 'text', // API trả về plain text
    });
    return response.data; // URL để chuyển hướng
  } catch (error) {
    throw error;
  }
};

// add payment
export const addPayment = async (payment: Payment): Promise<Payment> => {
  try {
    const response = await axios.post(`${API_URL}/api/payments`, payment, { headers: headers() });
    return response.data as Payment;
  } catch (error) {
    throw error;
  }
};

// update status payment
export const updatePaymentStatus = async (id: number, status: string): Promise<Payment> => {
  try {
    const response = await axios.put(`${API_URL}/api/payments/${id}/status`, null, {
      headers: headers(),
      params: { status },
    });
    return response.data as Payment;
  } catch (error) {
    throw error;
  }
};

// get list payment by status
export const getPaymentsByStatus = async (status: string): Promise<Payment[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/payments/status/${status}`, { headers: headers() });
    return response.data as Payment[];
  } catch (error) {
    throw error;
  }
};

// get information payment
export const getPaymentById = async (id: number): Promise<Payment> => {
  try {
    const response = await axios.get(`${API_URL}/api/payments/${id}`, { headers: headers() });
    return response.data as Payment;
  } catch (error) {
    throw error;
  }
};

