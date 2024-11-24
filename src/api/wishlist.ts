import axios from 'axios';
import { API_URL, headers } from './auth';
import {Listing} from './listing'
import {User} from './user'
import {Image} from './image'

// Authority interface
export interface Authority {
  authority: string;
}

// SelectedListing interface
export interface SelectedListing {
  id: number;
  user: User;
  listing: Listing;
  addedDate: string; // ISO date string
}

export const addSelectedListing = async (listingId: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/wishList/add`,
      null, // Không cần body trong POST request
      { params: { listingId }, headers: headers() }
    );
    return response.data;
  } catch (error) {
    console.log("add selected listing:", error);
    throw error;
  }
};

export const getAllSelectedListings = async (): Promise<SelectedListing[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/wishList/user`, {
      headers: headers(),
    });
    return response.data; // Trả về danh sách SelectedListing
  } catch (error) {
    console.log("get all selected listings:", error);
    throw error;
  }
};


export const deleteSelectedListing = async (listingId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/api/wishList/delete`, {
      headers: headers(),
      params: { listingId },  // Sử dụng params để truyền listingId
    });
    return response.data;
  } catch (error) {
    console.log("delete selected listing:", error);
    throw error;
  }
};


export const checkIfListingIsSelected = async (listingId: number): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/api/wishList/exists`, {
      params: { listingId },
      headers: headers(),
    });
    return response.data; // Trả về true hoặc false
  } catch (error) {
    console.log("check if listing is selected:", error);
    throw error;
  }
};

