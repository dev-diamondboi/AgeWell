import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Snackbar,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ElderlySearch = ({ user }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/caregiver/search-elderly?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (error) {
      console.error("❌ Error searching elderly users:", error);
      setSnackbarMessage("❌ Failed to search. Try again.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const sendRequest = async (elderlyId) => {
    try {
      await api.post(`/api/caregiver/request-elderly/${elderlyId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSentRequests((prev) => [...prev, elderlyId]);
      setSnackbarMessage("✅ Request sent successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("❌ Error sending caregiver request:", error);
      setSnackbarMessage(error.response?.data?.message || "❌ Request failed.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate("/dashboard")}> <ArrowBackIcon /> </IconButton>
        <Typography variant="h6">Search Elderly Users</Typography>
      </Box>

      <TextField
        fullWidth
        label="Search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth onClick={handleSearch}>Search</Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="info"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <List sx={{ mt: 3 }}>
        {results.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No results yet. Try searching above.
          </Typography>
        ) : (
          results.map((elderly) => (
            <ListItem
              key={elderly._id}
              divider
              secondaryAction={
                <Button
                  variant="outlined"
                  size="small"
                  disabled={sentRequests.includes(elderly._id)}
                  onClick={() => sendRequest(elderly._id)}
                >
                  {sentRequests.includes(elderly._id) ? "Requested" : "Request"}
                </Button>
              }
            >
              <Avatar sx={{ mr: 2 }}>
                {elderly.name?.charAt(0)?.toUpperCase() || "👤"}
              </Avatar>
              <ListItemText primary={elderly.name} secondary={elderly.email} />
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default ElderlySearch;
