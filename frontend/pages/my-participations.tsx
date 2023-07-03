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
import {
  useAccount,
  useNetwork,
  useSendTransaction,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { useEffect, useState } from "react";
import { getUsersSwapEngagments } from "../utils/apiService";
import { parseEther } from "viem";

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

const Participations = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [userEngagements, setUserEngagements] = useState([]);
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

  const renderActionButton = (status: string) => {
    switch (status) {
      case "revealed":
        return (
          <Button variant="contained" className={styles.button}>
            Swap
          </Button>
        );
      default:
      case "expired":
        return (
          <Button variant="contained" className={styles.button}>
            Withdraw
          </Button>
        );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUsersSwapEngagments(String(address));
        setUserEngagements(result.userSwapEngagements);
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
              {userEngagements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((engagement) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={engagement.hash}
                    >
                      <TableCell key="token" align="left">
                        {engagement.tokenSymbol}
                      </TableCell>
                      <TableCell key="amount" align="left">
                        {engagement.amount}
                      </TableCell>
                      <TableCell key="network" align="right">
                        {engagement.networkId}
                      </TableCell>
                      <TableCell key="time" align="right">
                        {engagement.timeLock}
                      </TableCell>
                      <TableCell key="status" align="center">
                        {engagement.status}
                      </TableCell>
                      <TableCell key="action" align="center">
                        {renderActionButton(engagement.status)}
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
          count={userEngagements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default Participations;
