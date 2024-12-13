import axios from 'axios';
import { API_URL, headers } from './auth';
import {User} from './user'
import { Payment } from './payment';

export interface Transaction {
    id: number;
    payment: Payment;
    sender: User;
    receiver: User;
    transactionDate: String; 
    transactionType: String;
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

// Fetch all transactions
export const fetchAllTransactions = async (): Promise<Transaction[]> => {
    const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: headers(),
    });
    return response.data;
};

// Process pending transactions
export const processPendingTransactions = async (): Promise<string> => {
    try {
        const response = await axios.put(`${API_URL}/api/transactions/process-pending-transactions`, {}, {
            headers: headers(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle HTTP errors (e.g., 403, 500)
            return error.response.data || "An unexpected error occurred.";
        } else {
            // Handle unexpected errors (e.g., network issues)
            return "An unexpected error occurred.";
        }
    }
};

// Refund failed transactions
export const refundFailedTransactions = async (): Promise<string> => {
    try {
        const response = await axios.put(`${API_URL}/api/transactions/refund-failed`, {}, {
            headers: headers(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle HTTP errors (e.g., 403, 500)
            return error.response.data || "An unexpected error occurred.";
        } else {
            // Handle unexpected errors (e.g., network issues)
            return "An unexpected error occurred.";
        }
    }
};

// Fetch deposit transactions
export const fetchDepositTransactions = async (): Promise<Transaction[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/transactions/deposits`, {
            headers: headers(),
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle HTTP errors
            throw new Error(error.response.data || "An unexpected error occurred.");
        } else {
            // Handle unexpected errors
            throw new Error("An unexpected error occurred.");
        }
    }
};

