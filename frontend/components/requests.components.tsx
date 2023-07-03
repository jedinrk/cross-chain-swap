import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import {
  approveToken,
  checkAllowance,
  engageSwapRequest,
  getActiveSwapRequests,
} from "../utils/apiService";
import {
  sepolia,
  useAccount,
  useNetwork,
  useSendTransaction,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "viem";

interface Column {
  id: "token" | "amount" | "network" | "time" | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "token", label: "Token", minWidth: 170 },
  { id: "amount", label: "Amount", minWidth: 100 },
  {
    id: "network",
    label: "Network",
    minWidth: 170,
    align: "right",
  },
  {
    id: "time",
    label: "Time",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "center",
  },
];

export default function Requests(props: any) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, pendingChainId, switchNetwork } = useSwitchNetwork();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeSwaps, setActiveSwaps] = useState([]);
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

  const processApproveToken = async (tokenAddress: any, amount: any) => {
    try {
      const txData = await approveToken(
        chain ? chain.id : sepolia.id,
        String(tokenAddress),
        amount
      );
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

  const processSwapRequest = async (swap: any) => {
    try {
      console.log("processSwapRequest: ", swap)
      const txData = await engageSwapRequest(
        swap.hash,
        String(parseEther(swap.amount)),
        swap.tokenAddress,
        "0xb852CdA1A01ed1eDE79Fe4885713055E1523fFf0",
        swap.timeLock,
        swap.networkId,
        chain ? chain.id : sepolia.id,
      );

      // Handle success or update state
      if (txData) {
        setTxDetails(txData);
      }
    } catch (error) {
      console.log(` Error Engaging request: ${error}`);
    }
  };

  const isCorrectNetwork = () => {
    try {
      if (chain?.id !== sepolia.id) {
        switchNetwork?.(sepolia.id);
        return false;
      }
      return true;
    } catch (error) {
      console.log(` Error Checking network: ${error}`);
    }
  };

  const handleButtonClick = async (swap: any) => {
    try {
      if (!isCorrectNetwork()) {
        return;
      }
      if ("0xb852CdA1A01ed1eDE79Fe4885713055E1523fFf0") {
        const allowance = await checkAllowance(
          chain ? chain.id : sepolia.id,
          String(address),
          "0xb852CdA1A01ed1eDE79Fe4885713055E1523fFf0"
        );

        if (allowance) {
          const swapAmount = Number(parseEther(swap.amount, "wei"));
          console.log("allowance: ", Number(allowance));
          console.log("input amount: ", swapAmount);
          if (swapAmount > Number(allowance)) {
            processApproveToken(
              "0xb852CdA1A01ed1eDE79Fe4885713055E1523fFf0",
              swapAmount
            );
          } else {
            await processSwapRequest(swap);
          }
        }
      }
    } catch (error) {}
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getActiveSwapRequests(String(address));
        setActiveSwaps(result.activeSwaps);
      } catch (error) {
        console.error("Error approving token:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (txDetails.to) {
      sendTransaction();
    }
  }, [txDetails]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activeSwaps
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((swap, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell key="token" align="left">
                      {swap.tokenSymbol}
                    </TableCell>
                    <TableCell key="amount" align="left">
                      {swap.amount}
                    </TableCell>
                    <TableCell key="network" align="right">
                      {swap.network}
                    </TableCell>
                    <TableCell key="time" align="right">
                      {`${swap.timeLock} seconds`}
                    </TableCell>
                    <TableCell key="action" align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleButtonClick(swap)}
                      >
                        Engage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={activeSwaps.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
