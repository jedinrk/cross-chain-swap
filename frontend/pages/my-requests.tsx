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

interface Data {
  token: string;
  amount: string;
  network: string;
  time: number;
  hash: string;
  status: string;
}

function createData(
  token: string,
  amount: string,
  network: string,
  time: number,
  hash: string,
  status: string
): Data {
  return { token, amount, network, time, hash, status };
}

const rows = [
  createData("USDT", "100", "Polygon -> BSC", 1, "", "pending"),
  createData("WETH", "20", "BSC -> Polygon", 1, "", "accepted"),
  createData("BNB", "30", "BSC -> Polygon", 1, "", "accepted"),
  createData("CAKE", "1000", "Polygon -> BSC", 1, "", "expired"),
  createData("AXPR", "5000", "BSC -> Polygon", 1, "", "expired"),
  createData("USDC", "100", "Polygon -> BSC", 1, "", "pending"),
];

const MyRequests = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
      case "accepted":
        return (
          <Button variant="contained" className={styles.button}>
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.hash}
                    >
                      <TableCell key="token" align="left">
                        {row.token}
                      </TableCell>
                      <TableCell key="amount" align="left">
                        {row.amount}
                      </TableCell>
                      <TableCell key="network" align="right">
                        {row.network}
                      </TableCell>
                      <TableCell key="time" align="right">
                        {row.time}
                      </TableCell>
                      <TableCell key="status" align="center">
                        {row.status}
                      </TableCell>
                      <TableCell key="action" align="center">
                        {renderActionButton(row.status)}
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
          count={rows.length}
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
