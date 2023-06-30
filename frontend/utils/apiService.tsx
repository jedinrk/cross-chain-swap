import axios, { AxiosResponse } from 'axios';

const API_BASE_URL: string = 'https://your-backend-server-url.com/api';

interface SwapRequest {
  hash: string;
  amount: number;
  token: string;
  userAddress: string;
}

export const createSwapRequest = async (hash: string, amount: number, token: string, userAddress: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createSwapRequest`, {
      hash,
      amount,
      token,
      userAddress,
    });
    return response.data;
  } catch (error) {
    throw error; //error.response ? error.response.data : error.message;
  }
};

export const getActiveSwapRequests = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getActiveSwapRequests`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsersSwapRequests = async (userAddress: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getUsersSwapRequests`, {
      params: {
        userAddress,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};