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
    amount: number;
    transactionDate: String; 
}

export const sellerOrder = async () :Promise<Transaction[]> => {
    const response = await axios.get(`${API_URL}/api/transactions/seller-orders`, {
        headers: headers(),
    });
    return response.data;
}