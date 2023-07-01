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

interface Data {
  token: string;
  amount: string;
  network: string;
  time: number;
  hash: string;
}

function createData(
  token: string,
  amount: string,
  network: string,
  time: number,
  hash: string
): Data {
  return { token, amount, network, time, hash };
}

const rows = [
  createData("USDT", "100", "Polygon -> BSC", 1, ""),
  createData("WETH", "20", "BSC -> Polygon", 1, ""),
  createData("BNB", "30", "BSC -> Polygon", 1, ""),
  createData("CAKE", "1000", "Polygon -> BSC", 1, ""),
  createData("AXPR", "5000", "BSC -> Polygon", 1, ""),
  createData("USDC", "100", "Polygon -> BSC", 1, ""),
];

export default function Requests() {
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.hash}>
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
