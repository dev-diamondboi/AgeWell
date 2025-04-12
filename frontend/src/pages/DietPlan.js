import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const DietPlan = ({ userId }) => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [dietPlan, setDietPlan] = useState([]);
  const [newMeal, setNewMeal] = useState({ meal: "", time: "", notes: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    const fetchDietPlan = async () => {
      try {
        const res = await api.get(`/api/diet/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDietPlan(res.data);
      } catch (error) {
        setError("Failed to load diet plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchDietPlan();
  }, [userId, token]);

  const addMeal = async () => {
    if (!loggedInUser || loggedInUser.role !== "caregiver") {
      setError("Only caregivers can add diet plans.");
      return;
    }

    try {
      const res = await api.post(`/api/diet/${userId}`, newMeal, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietPlan([...dietPlan, res.data.newDiet]);
      setSuccessMessage("Diet plan added!");
      setNewMeal({ meal: "", time: "", notes: "" });
    } catch (error) {
      setError("Failed to add diet plan.");
    }
  };

  const deleteMeal = async (dietId) => {
    if (!loggedInUser || loggedInUser.role !== "caregiver") {
      setError("Only caregivers can delete diet plans.");
      return;
    }

    try {
      await api.delete(`/api/diet/${userId}/${dietId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietPlan(dietPlan.filter((d) => d._id !== dietId));
      setSuccessMessage("Meal removed!");
    } catch (error) {
      setError("Failed to remove meal.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            🍽️ Diet Plan
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
          ) : (
            <>
              {loggedInUser?.role === "caregiver" && (
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Meal"
                    value={newMeal.meal}
                    onChange={(e) => setNewMeal({ ...newMeal, meal: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="time"
                    value={newMeal.time}
                    onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Notes (Optional)"
                    value={newMeal.notes}
                    onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <Button fullWidth variant="contained" onClick={addMeal}>
                    Add Meal
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Meal Schedule
              </Typography>
              <List>
                {dietPlan.map((meal) => (
                  <ListItem
                    key={meal._id}
                    secondaryAction={
                      loggedInUser?.role === "caregiver" && (
                        <IconButton color="error" onClick={() => deleteMeal(meal._id)}>
                          <Delete />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary={`${meal.meal} at ${meal.time}`}
                      secondary={meal.notes}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DietPlan;