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
      secret,
    });
    console.log("generateHash: ", response);
    return response.data.hash;
  } catch (error) {
    throw error;
  }
};

export const checkAllowance = async (
  networkId: Number,
  userAddress: string,
  tokenAddress: string
): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/approve/allowance`, {
      params: { networkId, userAddress, tokenAddress },
    });
    return response.data.allowance;
  } catch (error) {
    throw error;
  }
};

export const approveToken = async (
  networkId: Number,
  tokenAddress: string,
  amount: String
): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/approve/transaction`, {
      params: { networkId, tokenAddress, amount },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSwapRequest = async (
  networkId: Number,
  hash: string,
  amount: string,
  token: string,
  lockTime: number
): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createSwapRequest`, {
      hash,
      amount,
      token,
      lockTime,
      networkId
    });
    return response.data;
  } catch (error) {
    throw error; //error.response ? error.response.data : error.message;
  }
};

export const getActiveSwapRequests = async (
  userAddress: string
): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getActiveSwapRequests`, {
      params: { userAddress },
    });
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


export const getUsersSwapEngagments = async (
  userAddress: string
): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getUsersSwapEngagments`, {
      params: {
        userAddress,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const engageSwapRequest = async (
  hash: string,
  amount: string,
  sendToken: string,
  recieveToken: string,
  lockTime: number,
  networkId: Number
): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/engageSwapRequest`, {
      hash,
      amount,
      sendToken,
      recieveToken,
      lockTime,
      networkId
    });
    return response.data;
  } catch (error) {
    throw error; //error.response ? error.response.data : error.message;
  }
};

