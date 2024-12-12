import axios from 'axios';
import { API_URL, headers } from './auth';

export interface Address {
  id?: number;
  userId: number;        
  fullName: string;      
  phoneNumber: string;   
  street: string;       
  city: string;          
  province: string;      
  district: string;     
  ward?: string;         
  default: boolean;    
}

export const createAddress = async (address: Address): Promise<Address> => {
  try {
    const response = await axios.post(`${API_URL}/api/addresses`, address, {
      headers: headers(),
    });
    return response.data;
  } catch (exception) {
    console.error('Error creating address:', exception);
    throw exception;
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (id: number, address: Address): Promise<Address> => {
  try {
    const response = await axios.put(`${API_URL}/api/addresses/${id}`, address, {
      headers: headers(),
    });
    return response.data;
  } catch (exception) {
    console.error('Error updating address:', exception);
    throw exception;
  }
};

// Xoá địa chỉ
export const deleteAddress = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/addresses/${id}`, {
      headers: headers(),
    });
  } catch (exception) {
    console.error('Error deleting address:', exception);
    throw exception;
  }
};

// Lấy danh sách địa chỉ theo userId
export const getAddressesByUserId = async (userId: number): Promise<Address[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/addresses/user/${userId}`, {
      headers: headers(),
    });
    return response.data;
  } catch (exception) {
    console.error('Error fetching addresses:', exception);
    throw exception;
  }
};

// Get the default address
export const getDefaultAddress = async (): Promise<Address> => {
  try {
    const response = await axios.get(`${API_URL}/api/addresses/default`, {
      headers: headers(),
    });
    return response.data;
  } catch (exception) {
    console.error('Error fetching default address:', exception);
    throw exception;
  }
};

// Update the default address
export const updateDefaultAddress = async (idAddress: number): Promise<Address> => {
  try {
    const response = await axios.put(`${API_URL}/api/addresses/default`, null, {
      params: { idAddress },
      headers: headers(),
    });
    return response.data;
  } catch (exception) {
    console.error('Error updating default address:', exception);
    throw exception;
  }
};
