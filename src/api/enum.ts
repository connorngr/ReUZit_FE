import axios from 'axios';
import { API_URL, headers } from './auth';

export interface Condition {
    id: string;
    name: string;
}

// Fetch Conditions
export const getConditions = async (): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/api/enums/conditions`, {
    headers: headers(),
  });
  return response.data;
};

// Fetch Statuses
export const getStatuses = async (): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/api/enums/statuses`, {
    headers: headers(),
  });
  return response.data;
};
