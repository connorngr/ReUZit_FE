import axios from 'axios';
import { getToken } from '../utils/storage';
import { API_URL } from './auth';
import {Category} from './category';
import {Image} from './image'

export interface Listing {
  username: string;
  userId: number;
  categoryName: String;
  id: number;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: string;
  status: string;
  images: Image[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface IFormInputs {
  title: string;
  description: string;
  price: number;
  condition: string;
  categoryId: string;
  status: string;
  images: File[];
}

// Fetch all listings status active
export const fetchListingsAdmin = async (): Promise<Listing[]> => {
  try {
    const token = getToken();
      const response = await axios.get<Listing[]>(`${API_URL}/api/listings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      return response.data;
  } catch (error) {
      console.error('Error fetching listings', error);
      throw error;
  }
};

// Fetch all listings status active
export const fetchListingsUserEmail = async (): Promise<Listing[]> => {
    try {
      const token = getToken();
        const response = await axios.get<Listing[]>(`${API_URL}/api/listings/active/not-useremail`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      
        return response.data;
    } catch (error) {
        console.error('Error fetching listings', error);
        throw error;
    }
};

// Fetch all listings status active and userid
export const fetchListingsNotUserId = async (userId: number): Promise<Listing[]> => {
  try {
    const token = getToken();
    const response = await axios.get<Listing[]>(`${API_URL}/api/listings/active/not-userid`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { userId }, 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching listings by userId', error);
    throw error;
  }
};
// Fetch all listings status active and logout
export const logoutFetchListings = async (): Promise<Listing[]> => {
  try {
      const response = await axios.get<Listing[]>(`${API_URL}/api/listings/logout/active`);
    
      return response.data;
  } catch (error) {
      console.error('Error fetching listings', error);
      throw error;
  }
};

export const getListingById = async (id: number): Promise<Listing> => {
  try {
    const response = await axios.get<Listing>(`${API_URL}/api/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error; // Re-throw error to handle it elsewhere
  }
};


export const getActiveListingByCategoryId = async (id: number): Promise<Listing[]> => {
  const response = await axios.get<Listing[]>(`${API_URL}/api/listings/category/${id}/active`);
  return response.data;
}

export const getActiveListingsByCategoryIdNotUser = async (categoryId: number, userId: number): Promise<Listing[]> => {
  try {
    const response = await axios.get<Listing[]>(
      `${API_URL}/api/listings/category/${categoryId}/active/not-user`,
      {
        params: { userId }, // Pass the userId as a query parameter
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching active listings:', error);
    throw error;
  }
};

export const MyListings = async (): Promise<Listing[]> => {
    try {
      const token = getToken();  // Fetch the stored authentication token
  
      const response = await axios.get(`${API_URL}/api/listings/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching listings:", error);
      throw error;
    }
  };

// Create a new listing
export const createListing = async (listingData: FormData): Promise<Listing> => {
    // Log the listing data for debugging purposes
    const token = getToken();
    try {
        const response = await axios.post<Listing>(`${API_URL}/api/listings`, listingData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });

        console.log('Created listing:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error creating listing', error);
        throw error;
    }
};

export const updateListing = async (id: number, listingData: FormData): Promise<Listing> => {
    const token = getToken(); // Lấy token từ bộ nhớ lưu trữ

  try {
    const response = await axios.put(`${API_URL}/api/listings/${id}`, listingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
}

export const deleteListings = async (ids: number[]): Promise<Listing[]> => {
  try {
      const token = getToken();
      const response = await axios.delete<Listing[]>(`${API_URL}/api/listings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
      params: { ids: ids.join(',') }
      });
      
      return response.data || [];
  } catch (error) {
    console.error('Error deleting listings:', error);
    throw new Error('Failed to delete listings.');
  }
};


