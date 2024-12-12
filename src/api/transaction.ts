import axios from 'axios';
import { API_URL, headers } from './auth';
import {Listing } from './listing'
import {User} from './user'
import { Payment } from './payment';

export interface Transaction {
    id: number;
    payment: Payment;
    sender: User;
    receiver: User;
    transactionDate: String; 
}

export const sellerOrder = async () :Promise<Transaction[]> => {
    const response = await axios.get(`${API_URL}/api/transactions/seller-orders`, {
        headers: headers(),
    });
    return response.data;
}

export const buyerOrder = async () :Promise<Transaction[]> => {
    const response = await axios.get(`${API_URL}/api/transactions/buyer-orders`, {
        headers: headers(),
    });
    return response.data;
}