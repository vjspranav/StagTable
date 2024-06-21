import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Waves, RefreshCcw as Refresh } from "lucide-react";
import axios from "axios";
import MaxWidthDialog from "./statusDialog"; // Assuming this is the correct import for your status popup

const OceanicAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxShadow: theme.shadows[3],
}));

const OceanicCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 200px)",
  background: "linear-gradient(linear, #caf0f8 90%, #90e0ef 10%)",
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
    borderRadius: "4px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    // backgroundColor: "#023e8a",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  "&.MuiTableCell-body": {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // "&:nth-of-type(odd)": {
  //   backgroundColor: theme.palette.action.hover,
  // },
  // "&:last-child td, &:last-child th": {
  //   border: 0,
  // },
  // transition: "background-color 0.3s",
  // "&:hover": {
  //   backgroundColor: theme.palette.action.selected,
  // },
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(144, 224, 239, 0.3)",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "rgba(144, 224, 239, 0.5) !important",
  },
}));

const RefreshButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  background: "linear-gradient(45deg, #023e8a 30%, #0077b6 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  "&:hover": {
    background: "linear-gradient(45deg, #0077b6 30%, #023e8a 90%)",
  },
}));

function MaterialisticOceanicTable() {
  const [users, setUsers] = useState([]);
  const [version, setVersion] = useState("13");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://api.stag-os.org/${version}/maintainers/all`
      );
      setUsers(res.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, [version]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <OceanicAppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <Waves size={24} style={{ marginRight: "10px" }} />
            StagOS Maintainer Applications
          </Typography>
          <Typography variant="subtitle1" style={{ marginRight: "10px" }}>
            Version:
          </Typography>
          <Select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{ backgroundColor: "white", height: "40px" }}
          >
            <MenuItem value="14">14</MenuItem>
            <MenuItem value="13">13</MenuItem>
            <MenuItem value="old">12</MenuItem>
          </Select>
        </Toolbar>
      </OceanicAppBar>
      <OceanicCard>
        <CardContent>
          <StyledTableContainer component={Paper}>
            <Table stickyHeader aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>User Name</StyledTableCell>
                  <StyledTableCell>Telegram User Name</StyledTableCell>
                  <StyledTableCell>Github Id</StyledTableCell>
                  <StyledTableCell>Device Name</StyledTableCell>
                  <StyledTableCell>Device Code</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <StyledTableRow key={user._id}>
                    <StyledTableCell component="th" scope="row">
                      {user.name}
                    </StyledTableCell>
                    <StyledTableCell>{user.tg_username}</StyledTableCell>
                    <StyledTableCell>{user.github_username}</StyledTableCell>
                    <StyledTableCell>{user.device_name}</StyledTableCell>
                    <StyledTableCell>{user.device_codename}</StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>
                      <MaxWidthDialog
                        status={user.status}
                        username={user.name}
                        id={user._id}
                        user={user}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
          <RefreshButton onClick={fetchUsers} startIcon={<Refresh />}>
            Refresh Users List
          </RefreshButton>
        </CardContent>
      </OceanicCard>
    </>
  );
}

export default MaterialisticOceanicTable;
