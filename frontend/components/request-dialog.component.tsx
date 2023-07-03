import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createSwapRequest } from "../utils/apiService";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useDebounce } from "use-debounce";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

import { parseEther } from "viem";

const RequestDialog = (props: any) => {
  const { onClose } = props;

  const [hash, setHash] = useState("");
  const [debouncedHash] = useDebounce(hash, 500);

  const [amount, setAmount] = useState(0);
  const [debouncedAmount] = useDebounce(amount, 500);

  const [token, setToken] = useState("");
  const [debouncedToken] = useDebounce(token, 500);

  const [timeLock, setTimeLock] = useState(900); // Default 15 mins
  const [debouncedTimeLock] = useDebounce(timeLock, 500);

  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: "0",
  });

  // const { config } = usePrepareSendTransaction({
  //   to: String(txDetails.to),
  //   data: String(txDetails.data),
  //   value: parseEther(txDetails.value),
  // });

  const { data, sendTransaction } = useSendTransaction({
    to: String(txDetails.to),
    data: `0x${String(txDetails.data)}`,
    value: txDetails.value? parseEther(String(txDetails.value)) : parseEther("0"),
  });

  //const { data, sendTransaction } = useSendTransaction(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleHashChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHash(e.target.value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform API request here using hash, amount, and token
    try {
      const txData = await createSwapRequest(hash, amount, token, timeLock);
      console.log("Swap request created:", txData);

      // Handle success or update state
      if (txData) {
        setTxDetails(txData);
      }
      
    } catch (error) {
      console.error("Error creating swap request:", error);
      // Handle error or show error message
    }

    // Reset form fields
    setHash("");
    setAmount(0);
    setToken("");
    setTimeLock(0);
  };

  useEffect(() => {
    if (txDetails.to) {
      sendTransaction();
    }
  }, [txDetails]);

  return (
    <div style={{ padding: 15 }}>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <h2>Submit Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="hash">Hash:</label>
          <input
            type="text"
            id="hash"
            value={hash}
            onChange={handleHashChange}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div>
          <label htmlFor="token">Token:</label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={handleTokenChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RequestDialog;
