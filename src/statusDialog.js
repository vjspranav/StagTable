import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Chip, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import axios from "axios";

export default function MaxWidthDialog(props) {
  const user = props.user;
  const username = props.username;
  const userId = props.id;
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [status, setStatus] = React.useState(props.status);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("Enter Password");
  const [defaultStatus, setdefaultStatus] = React.useState(props.status);

  const style = {
    display: "flex",
  };

  const chipStyle = {
    margin: "0 5px",
    // width: "10px",
    cursor: "pointer",
  };

  const openLink = (link) => {
    window.open(link, "_blank") || window.location.replace(link);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStatusChange = (event) => {
    setStatus(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  const handlePasswordInput = (event) => {
    if (event.keyCode == 13) {
      checkPassword();
    } else {
      setPassword(event.target.value);
    }
  };

  const checkPassword = () => {
    const data = { pass: password, id: userId, status: status };
    console.log(data);
    if (status == "Accepted") {
      axios
        .post("https://api.stag-os.org/maintainers/createPR", data)
        .then((res) => {
          if (res.data.status != 200) {
            setError(true);
            setErrorMsg(res.data.message);
            setStatus(defaultStatus);
          } else {
            axios
              .post("https://api.stag-os.org/maintainers/updateStatus", data)
              .then((res) => {
                // console.log(res.data);
                if (res.data.status != 200) {
                  setError(true);
                  setErrorMsg(res.data.message);
                  setStatus(defaultStatus);
                } else {
                  setdefaultStatus(status);
                  setError(false);
                  setErrorMsg(res.data.message);
                }
              })
              .catch((err) => {
                // console.log(err);
                setError(true);
                setErrorMsg(err);
              });
          }
        });
    } else {
      axios
        .post("https://api.stag-os.org/maintainers/updateStatus", data)
        .then((res) => {
          // console.log(res.data);
          if (res.data.status != 200) {
            setError(true);
            setErrorMsg(res.data.message);
            setStatus(defaultStatus);
          } else {
            setdefaultStatus(status);
            setError(false);
            setErrorMsg(res.data.message);
          }
        })
        .catch((err) => {
          // console.log(err);
          setError(true);
          setErrorMsg(err);
        });
      setPassword("");
      setError(false);
    }
  };

  return (
    <React.Fragment>
      <Button
        variant={defaultStatus == "Accepted" ? "contained" : "outlined"}
        onClick={handleClickOpen}
        color={
          defaultStatus == "Accepted"
            ? "success"
            : defaultStatus == "Rejected"
            ? "error"
            : "secondary"
        }
      >
        {defaultStatus}
      </Button>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          {username} -{" "}
          <p
            style={{
              display: "inline",
              color:
                defaultStatus == "Accepted"
                  ? "green"
                  : defaultStatus == "Rejected"
                  ? "red"
                  : defaultStatus == "Applied"
                  ? "orange"
                  : "violet",
            }}
          >
            {defaultStatus}
          </p>{" "}
          - {user._id}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Device : {user.device_company} {user.device_name} (
            {user.device_codename})
          </DialogContentText>
          <DialogContentText>Selinux : {user.selinux_status}</DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="status">Status</InputLabel>
              <Select
                autoFocus
                value={status}
                onChange={handleStatusChange}
                label="maxWidth"
                inputProps={{
                  name: "max-width",
                  id: "max-width",
                }}
              >
                <MenuItem value="Applied">Applied</MenuItem>
                <MenuItem value="Reviewing">Reviewing</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={handlePasswordInput}
              onKeyDown={handlePasswordInput}
            />
            {error ? (
              <Alert severity="error">{errorMsg}</Alert>
            ) : (
              <Alert severity="success">{errorMsg}</Alert>
            )}
            <DialogActions
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button onClick={checkPassword}>Change Status</Button>
            </DialogActions>
            <Box sx={style}>
              <Chip
                label="Device Tree"
                sx={chipStyle}
                onClick={() => openLink(user.device_tree)}
              ></Chip>
              <Chip
                label="Common Tree"
                sx={{ ...chipStyle, display: user.common_tree ? "" : "none" }}
                onClick={() => openLink(user.common_tree)}
              ></Chip>
              <Chip
                label="Kernel"
                sx={chipStyle}
                onClick={() => openLink(user.kernel)}
              ></Chip>
              <Chip
                label="Vendor"
                sx={chipStyle}
                onClick={() => openLink(user.vendor)}
              ></Chip>
              <Chip
                label="Common Vendor"
                sx={{ ...chipStyle, display: user.common_vendor ? "" : "none" }}
                onClick={() => openLink(user.common_vendor)}
              ></Chip>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
