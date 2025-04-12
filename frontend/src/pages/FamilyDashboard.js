import React, { useEffect, useState, useContext } from "react";
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  Card, CardContent, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

const FamilyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [assignedElderly, setAssignedElderly] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
    try {
      const res = await api.get("/api/users/family/assigned", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignedElderly(res.data);
    } catch (error) {
      console.error("Error fetching assigned elderly:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await api.get(`/api/users/search?name=${searchQuery}&role=elderly`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
      setError("Search failed.");
    }
  };

  const handleSendRequest = async (elderlyId) => {
    try {
      await api.post(`/api/users/request-family/${elderlyId}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Request sent!");
    } catch (error) {
      console.error("Failed to send request:", error);
      setError("Could not send request.");
    }
  };

  const handleViewDetails = () => {
    if (assignedElderly?._id) {
      navigate(`/elderly/${assignedElderly._id}`);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        👨‍👩‍👧 Family Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {assignedElderly && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">🎯 Assigned Elderly:</Typography>
            <Typography>Name: {assignedElderly.name}</Typography>
            <Typography>Email: {assignedElderly.email}</Typography>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleViewDetails}>
              View Elderly Details
            </Button>
          </CardContent>
        </Card>
      )}

      <Typography sx={{ mb: 2 }}>
        🔍 Search and send connection request to another elderly user:
      </Typography>

      <TextField
        label="Search Elderly by Name"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Button variant="contained" onClick={handleSearch} sx={{ mb: 2 }}>
        Search
      </Button>

      <List>
        {searchResults.map((elderly) => (
          <ListItem
            key={elderly._id}
            secondaryAction={
              <Button onClick={() => handleSendRequest(elderly._id)} variant="outlined">
                Send Request
              </Button>
            }
          >
            <ListItemText primary={elderly.name} secondary={elderly.email} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FamilyDashboard;
