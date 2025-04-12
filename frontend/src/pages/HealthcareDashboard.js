import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

const HealthcareDashboard = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    // Debounce search input
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeout = setTimeout(() => {
      performSearch(searchTerm);
    }, 400); // Delay of 400ms

    setTimeoutId(newTimeout);

    return () => clearTimeout(newTimeout);
  }, [searchTerm]);

  const performSearch = async (term) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/users/search?role=elderly&name=${term}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResults(res.data);
    } catch (error) {
      console.error("❌ Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (id) => {
    navigate(`/elderly/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || "Healthcare Professional"} 👨‍⚕️
        </Typography>

        <Box mt={3}>
          <Typography variant="h6">🔍 Search Elderly User</Typography>
          <TextField
            fullWidth
            label="Start typing to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ my: 2 }}
          />

          {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}

          {results.length > 0 && (
            <List sx={{ mt: 2 }}>
              {results.map((elderly) => (
                <ListItem
                  button
                  key={elderly._id}
                  onClick={() => handleSelectUser(elderly._id)}
                >
                  <ListItemText
                    primary={elderly.name}
                    secondary={`Email: ${elderly.email}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default HealthcareDashboard;
