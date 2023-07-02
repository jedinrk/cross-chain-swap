import axios, { AxiosResponse } from "axios";

const API_BASE_URL: string = "http://localhost:5050";

interface SwapRequest {
  hash: string;
  amount: number;
  token: string;
  userAddress: string;
}

export const generateHash = async (secret: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generatehash`, {
      secret
    });
    console.log("generateHash: ", response)
    return response.data.hash;
  } catch (error) {
    throw error;
  }
};

export const createSwapRequest = async (
  hash: string,
  amount: number,
  token: string,
  userAddress: string
): Promise<any> => {
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

export const getUsersSwapRequests = async (
  userAddress: string
): Promise<any> => {
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
