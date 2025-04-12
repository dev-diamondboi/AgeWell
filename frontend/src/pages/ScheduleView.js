import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Box
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import api from "../api";

const ScheduleView = ({ user }) => {
  const [groupedSchedules, setGroupedSchedules] = useState({ caregiver: [], healthcare: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      const userId = user?._id || user?.id;
      if (!userId) return;


      try {
        const res = await api.get(`/api/schedule/view-all/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setGroupedSchedules(res.data);
      } catch (err) {
        console.error("❌ Error fetching schedules:", err);
        setError("Failed to load schedules.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user]);

  const renderScheduleCards = (schedules) =>
    schedules.length === 0 ? (
      <Typography>No schedules found.</Typography>
    ) : (
      schedules.map((schedule) => (
        <Card key={schedule._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{schedule.title}</Typography>
            <Typography variant="body2">{schedule.description}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <EventIcon sx={{ fontSize: 18, mr: 1 }} />
              {schedule.date} at {schedule.time}
            </Typography>
          </CardContent>
        </Card>
      ))
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        📅 View Schedule
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, background: "#f9f9f9" }}>
              <Typography variant="h6" gutterBottom align="center">
                👤 Caregiver's Schedules
              </Typography>
              {renderScheduleCards(groupedSchedules.caregiver)}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, background: "#f9f9f9" }}>
              <Typography variant="h6" gutterBottom align="center">
                👨‍⚕️ Healthcare's Schedules
              </Typography>
              {renderScheduleCards(groupedSchedules.healthcare)}
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ScheduleView;
