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
import { getActiveSwapRequests } from "../utils/apiService";
import { useAccount } from "wagmi";
import { createData } from "../utils/common";

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

export default function Requests() {
  const { address, isConnected } = useAccount();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeSwaps, setActiveSwaps] = useState([]);

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
              .map((swap) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={swap.hash}
                  >
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
                      {`${swap.time} seconds`}
                    </TableCell>
                    <TableCell key="action" align="center">
                      <Button variant="contained">Engage</Button>
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
