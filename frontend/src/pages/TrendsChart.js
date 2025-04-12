import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../api";
import { Container, Typography, Box, CircularProgress, TextField, Grid } from "@mui/material";

const TrendsChart = ({ user }) => {
  const [vitalsData, setVitalsData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = localStorage.getItem("token");
  const userId = user?._id || user?.id;

  const applyDateFilter = (data) => {
    if (!startDate && !endDate) return data;
    return data.filter(entry => {
      const entryDate = new Date(entry.date);
      const afterStart = startDate ? new Date(startDate) <= entryDate : true;
      const beforeEnd = endDate ? entryDate <= new Date(endDate) : true;
      return afterStart && beforeEnd;
    });
  };

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const [vitalsRes, checkinsRes] = await Promise.all([
          api.get(`/api/vitals/history/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/api/checkin/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setVitalsData(vitalsRes.data || []);
        setMoodData(checkinsRes.data || []);
      } catch (err) {
        console.error("Error fetching trend data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTrends();
  }, [userId, token]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>📊 Health Trends</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
      </Grid>

      {loading ? <CircularProgress /> : (
        <>
          <Box sx={{ height: 300, mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Vitals Over Time</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applyDateFilter(vitalsData)} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="heartRate" stroke="#1976d2" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="bloodPressure" stroke="#2e7d32" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="bloodSugar" stroke="#ff8f00" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ height: 300 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Mood Check-Ins</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applyDateFilter(moodData)} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#d32f2f" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Container>
  );
};

export default TrendsChart;
