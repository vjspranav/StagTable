import React from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Paper,
  Button,
  TableRow,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";
import axios from "axios";
// import BasicModal from './popup';
import MaxWidthDialog from "./statusDialog";

const useStyles = makeStyles({
  table: {
    minWidth: 100,
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function StagTable() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [loadUsers, setLoadUsers] = useState(false);

  useEffect(() => {
    axios
      .get("https://api.stag-os.org/maintainers/all")
      .then((res) => {
        // console.log(res.data.data);
        setUsers(res.data.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, [loadUsers]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">User Name</StyledTableCell>
              <StyledTableCell align="center">
                Telegram User Name
              </StyledTableCell>
              <StyledTableCell align="center">Github Id</StyledTableCell>
              <StyledTableCell align="center">Device Name</StyledTableCell>
              <StyledTableCell align="center">Device Code</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user._id}>
                <TableCell align="center">{user.name}</TableCell>
                <TableCell align="center">{user.tg_username}</TableCell>
                <TableCell align="center">{user.github_username}</TableCell>
                <TableCell align="center">{user.device_name}</TableCell>
                <TableCell align="center">{user.device_codename}</TableCell>
                <TableCell align="center" scope="row">
                  {user.email}
                </TableCell>
                <TableCell align="center">
                  <MaxWidthDialog
                    status={user.status}
                    username={user.name}
                    id={user._id}
                    user={user}
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          onClick={() => {
            setLoadUsers(!loadUsers);
          }}
          style={{ display: "flex", margin: "auto" }}
        >
          Refresh Users List
        </Button>
      </TableContainer>
    </>
  );
}

export default StagTable;
