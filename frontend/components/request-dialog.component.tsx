import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  approveToken,
  checkAllowance,
  createSwapRequest,
} from "../utils/apiService";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useDebounce } from "use-debounce";
import {
  sepolia,
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";

import { parseEther } from "viem";

const RequestDialog = (props: any) => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const { onClose } = props;

  const [hash, setHash] = useState("");
  const [amount, setAmount] = useState("0");
  const [debouncedAmount] = useDebounce(amount, 500);
  const [token, setToken] = useState("");
  const [receiveToken, setRecieveToken] = useState("");
  const [timeLock, setTimeLock] = useState(900); // Default 15 mins

  const [requireApproval, setRequireApproval] = useState(false);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: "0",
  });

  const { data, sendTransaction } = useSendTransaction({
    to: String(txDetails.to),
    data: String(txDetails.data),
    value: txDetails.value
      ? parseEther(String(txDetails.value))
      : parseEther("0"),
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleHashChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHash(e.target.value);
  };

  const handleAmountChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputAmount = Number(parseEther(e.target.value));
    setAmount(e.target.value);

    if (token) {
      const allowance = await checkAllowance(
        chain ? chain.id : sepolia.id,
        String(address),
        token
      );

      if (allowance) {
        console.log("allowance: ", Number(allowance));
        console.log("input amount: ", inputAmount);
        if (inputAmount > Number(allowance)) {
          setRequireApproval(true);
        } else {
          setRequireApproval(false);
        }
      }
    }
  };

  const handleTimeLockChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeLock(Number(e.target.value));
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const handleRecieveTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecieveToken(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform API request here using hash, amount, and token
    try {
      const txData = await createSwapRequest(
        chain ? chain.id : sepolia.id,
        hash,
        String(parseEther(amount, 'wei')),
        token,
        timeLock,
      );
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
    setRecieveToken("");
    setTimeLock(0);
  };

  const handleApproveButton = async () => {
    try {
      const txData = await approveToken(chain ? chain.id : sepolia.id, String(token), String(parseEther(amount, 'wei')));
      console.log("Approve token:", txData);

      // Handle success or update state
      if (txData) {
        setTxDetails(txData);
      }
    } catch (error) {
      console.error("Error approving token:", error);
      // Handle error or show error message
    }
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
          <label htmlFor="token">Token:</label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={handleTokenChange}
          />
        </div>
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
          <label htmlFor="token">Lock time:</label>
          <input
            type="text"
            id="timeLock"
            value={timeLock}
            onChange={handleTimeLockChange}
          />
        </div>
        <div>
          <label htmlFor="token">Receivable Token</label>
          <input
            type="text"
            id="receiveToken"
            value={receiveToken}
            onChange={handleRecieveTokenChange}
          />
        </div>
        {requireApproval ? (
          <button type="button" onClick={handleApproveButton}>
            Approve
          </button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </form>
    </div>
  );
};

export default RequestDialog;
