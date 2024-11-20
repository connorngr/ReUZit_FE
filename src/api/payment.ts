import axios from 'axios';
import { getToken } from '../utils/storage';
import { API_URL, headers } from './auth';


export const getPayment = async (price: number, idListing: number, idUser: number): Promise<string> => {
    try {
        const token = getToken();
      const response = await axios.get(`${API_URL}/api/payments/pay`, {
        params: {
          price,
          idListing,
          idUser,
        },
        headers: headers(),
        responseType: 'text', // API trả về plain text
      });
      return response.data; // URL để chuyển hướng
    } catch (error) {
       throw error;
    }
  };