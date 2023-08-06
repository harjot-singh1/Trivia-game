import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./userStats.css";
import NavBar from "../../components/NavBar";

const UserStats = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data based on email
  const fetchUserData = async (email) => {
    if (email) {
      try {
        const res = await axios.get(
          `https://qiuc1xjkaj.execute-api.us-east-1.amazonaws.com/dev/user/profile?email=${email}`
        );
        if (res.data) {
          return res.data;
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    } else {
      return;
    }
  };

  // Fetch all user data
  const fetchAllUserData = async () => {
    try {
      const res = await axios.get(
        "https://qiuc1xjkaj.execute-api.us-east-1.amazonaws.com/dev/user/all"
      );
      if (res.data) {
        return res.data;
      }
    } catch (error) {
      console.error("Failed to fetch all user data", error);
    }
  };

  const handleRowClick = async (user) => {
    const userData = await fetchUserData(user.email);
    setSelectedUser(userData);
  };

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("userData"));
    (async () => {
      setCurrentUser(await fetchUserData(user.email));
      console.log(selectedUser);
    })();
    (async () => {
      const userData = await fetchAllUserData();
      setAllUsers(userData);
      if (userData.length > 0) {
        const selectedUserData = await fetchUserData(userData[0].email);
        setSelectedUser(selectedUserData);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <Grid container direction="column" spacing={2}>
        <Grid item container direction="row" xs={2} sx={{ borderBottom: "1px solid black" }}>
          <Grid item xs={6} sx={{ display: "flex", "flexFlow": "column", justifyContent: "center", alignItems: "center", paddingBottom: "1rem" }}>
            <img style={{ borderRadius: "50%", boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)" }} src={currentUser?.profileImage} width={180} height={180} alt="Profile"></img>
            <Typography sx={{ marginTop: "0.5rem" }}>{currentUser?.name}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ borderLeft: "1px solid black", paddingLeft: "1rem" }}>
            <Typography className="user-info">Email: {currentUser?.email}</Typography>
            <Typography className="user-info">
              Total Played: {currentUser?.["total-played"]}
            </Typography>
            <Typography className="user-info">Wins: {currentUser?.win}</Typography>
            <Typography className="user-info">Losses: {currentUser?.loss}</Typography>
            <Typography className="user-info">Points: {currentUser?.points}</Typography>
          </Grid>
        </Grid>
        <Grid item container direction="row" xs={6}>
          <Grid item xs={6} sx={{ borderRight: "1px solid black", padding: "1rem 0.5rem", marginTop: "-1rem" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Total Played</TableCell>
                    <TableCell>Wins</TableCell>
                    <TableCell>Losses</TableCell>
                    <TableCell>Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(allUsers) ? (allUsers.map((user) => (
                    <TableRow
                      key={user.email}
                      onClick={() => handleRowClick(user)}
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.totalPlayed}</TableCell>
                      <TableCell>{user.win}</TableCell>
                      <TableCell>{user.loss}</TableCell>
                      <TableCell>{user.points}</TableCell>
                    </TableRow>
                  ))) : (<></>)}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={6}>
            {selectedUser && (
              <>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <img style={{ borderRadius: "50%", boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2)", marginBottom: "0.5rem" }} src={selectedUser?.profileImage} width={180} height={180} alt="Profile"></img>

                </div>
                <Typography className="user-info-other">{selectedUser.name}</Typography>
                <Typography className="user-info-other">Email: {selectedUser.email}</Typography>
                <Typography className="user-info-other">
                  Total Played: {selectedUser["total-played"]}
                </Typography>
                <Typography className="user-info-other">Wins: {selectedUser.win}</Typography>
                <Typography className="user-info-other">Losses: {selectedUser.loss}</Typography>
                <Typography className="user-info-other">Points: {selectedUser.points}</Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default UserStats;
