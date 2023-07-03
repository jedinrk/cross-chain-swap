import Topbar from "../components/topbar.components";
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
import styles from "../styles/Request.module.css";
import { getUsersSwapRequests, revealSecret } from "../utils/apiService";
import {
  useAccount,
  useNetwork,
  useSendTransaction,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import {
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
} from "wagmi/chains";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface Column {
  id: "token" | "amount" | "network" | "time" | "status" | "action";
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
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "center",
  },
];

const MyRequests = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [secret, setSecret] = useState("");
  const [showInput, setShowInput] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [userRequests, setUserRequests] = useState([]);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSwapButton = async () => {
    setShowInput(!showInput);
  };

  const handleInputSecret = (inputtedValue: string) => {
    setSecret(inputtedValue);
  };

  const handleRevealSecret = async (request: any) => {
    try {
      if (!isCorrectNetwork(request)) {
        return;
      }
      const txData = await revealSecret(secret, chain ? chain.id : sepolia.id);
      if (txData) {
        setTxDetails(txData);
      }
    } catch (error) {
      console.log(`error processing swap token, ${error}`);
    }
  };

  const renderActionButton = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <Button
            variant="contained"
            className={styles.button}
            onClick={handleSwapButton}
          >
            Swap
          </Button>
        );
      case "expired":
        return (
          <Button variant="contained" className={styles.button}>
            Withdraw
          </Button>
        );
      default:
      case "pending":
        return (
          <Button variant="contained" className={styles.button} disabled>
            Swap
          </Button>
        );
    }
  };

  const renderRevealSecret = (request: any) => {
    return (
      <div>
        <input
          value={secret}
          onChange={(e) => {
            handleInputSecret(e.target.value);
          }}
        />
        <button onClick={() => handleRevealSecret(request)}>Reveal</button>
        <IconButton onClick={handleSwapButton}>
          <CloseIcon />
        </IconButton>
      </div>
    );
  };

  const isCorrectNetwork = (userRequest: any) => {
    console.log(userRequest);
    try {
      if (
        userRequest?.sender == address &&
        userRequest?.networkId == chain?.id
      ) {
        switch (chain?.id) {
          case polygonMumbai.id:
            switchNetwork?.(sepolia.id);
            break;
          default:
          case sepolia.id:
            switchNetwork?.(polygonMumbai.id);
            break;
        }
        return false;
      }

      return true;
    } catch (error) {
      console.log(` Error Checking network: ${error}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUsersSwapRequests(String(address));
        setUserRequests(result.userSwapRequests);
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
    <>
      <Topbar />
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
              {userRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={request.hash}
                    >
                      <TableCell key="token" align="left">
                        {request.tokenSymbol}
                      </TableCell>
                      <TableCell key="amount" align="left">
                        {request.amount}
                      </TableCell>
                      <TableCell key="network" align="right">
                        {request.network}
                      </TableCell>
                      <TableCell key="time" align="right">
                        {request.timeLock}
                      </TableCell>
                      <TableCell key="status" align="center">
                        {request.status}
                      </TableCell>
                      <TableCell key="action" align="center">
                        {showInput
                          ? renderRevealSecret(request)
                          : renderActionButton(request.status)}
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
          count={userRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default MyRequests;
