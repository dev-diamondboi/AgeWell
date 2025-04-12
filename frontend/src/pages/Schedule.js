import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const Schedule = ({ userId }) => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ title: "", description: "", date: "", time: "" });
  const [editDialog, setEditDialog] = useState({ open: false, scheduleId: null });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    const fetchSchedules = async () => {
      try {
        const res = await api.get(`/api/schedule/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(res.data);
        setError("");
      } catch (error) {
        setError("Failed to load schedules.");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [userId, token]);

  const addSchedule = async () => {
    if (!loggedInUser || !(loggedInUser.role === "caregiver" || loggedInUser.role === "healthcare")) {
      setError("Only caregivers or healthcare professionals can add schedules.");
      return;
    }

    try {
      const res = await api.post(`/api/schedule/${userId}`, newSchedule, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules([...schedules, res.data.newSchedule]);
      setSuccessMessage("Schedule added!");
      setNewSchedule({ title: "", description: "", date: "", time: "" });
    } catch (error) {
      setError("Failed to add schedule.");
    }
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/api/schedule/${userId}/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(schedules.filter((s) => s._id !== scheduleId));
      setSuccessMessage("Schedule removed!");
    } catch (error) {
      setError("Failed to remove schedule.");
    }
  };

  const handleEditClick = (schedule) => {
    setNewSchedule({ ...schedule });
    setEditDialog({ open: true, scheduleId: schedule._id });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/api/schedule/${userId}/${editDialog.scheduleId}`, newSchedule, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(schedules.map((s) => (s._id === editDialog.scheduleId ? { ...s, ...newSchedule } : s)));
      setEditDialog({ open: false, scheduleId: null });
      setSuccessMessage("Schedule updated!");
    } catch (error) {
      setError("Failed to update schedule.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
        📅 Schedule
      </Typography>

      {error && schedules.length === 0 && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <>
          {(loggedInUser?.role === "caregiver" || loggedInUser?.role === "healthcare") && (
            <Box sx={{ marginBottom: 3 }}>
              <TextField fullWidth label="Title" value={newSchedule.title} onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField fullWidth label="Description" value={newSchedule.description} onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField fullWidth type="date" value={newSchedule.date} onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField fullWidth type="time" value={newSchedule.time} onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })} sx={{ marginBottom: 1 }} />
              <Button fullWidth variant="contained" onClick={addSchedule} sx={{ marginTop: 1 }}>
                Add Schedule
              </Button>
            </Box>
          )}

          {schedules.length === 0 ? (
            <Typography>No schedules yet.</Typography>
          ) : (
            <List>
              {schedules.map((schedule) => (
                <ListItem key={schedule._id} secondaryAction={
                  (loggedInUser?.role === "caregiver" || loggedInUser?.role === "healthcare") && (
                    <>
                      <IconButton color="primary" onClick={() => handleEditClick(schedule)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => deleteSchedule(schedule._id)}><Delete /></IconButton>
                    </>
                  )
                }>
                  {schedule.title} - {schedule.date} at {schedule.time}
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, scheduleId: null })}>
        <DialogTitle>Edit Schedule</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newSchedule.title}
            onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={newSchedule.description}
            onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            value={newSchedule.date}
            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="time"
            value={newSchedule.time}
            onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, scheduleId: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Schedule;
