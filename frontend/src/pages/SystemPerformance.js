import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Container, Typography, Grid, Paper, CircularProgress, Alert
} from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from "chart.js";
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const SystemPerformance = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMetrics = async () => {
    try {
      const res = await api.get("/api/admin/system-metrics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMetrics(res.data);
    } catch (err) {
      setError("Failed to load system performance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const {
    userCount, activeUsers, deactivatedUsers,
    notificationCount, scheduleCount,
    memory, appMemory, cpu, uptime, failedLogins
  } = metrics;

  const userStats = {
    labels: ["Total", "Active", "Deactivated"],
    datasets: [{
      label: "Users",
      data: [userCount, activeUsers, deactivatedUsers],
      backgroundColor: ["#1976D2", "#66BB6A", "#FF7043"]
    }]
  };

  const appUsage = {
    labels: ["Schedules", "Notifications"],
    datasets: [{
      label: "App Usage",
      data: [scheduleCount, notificationCount],
      backgroundColor: ["#FFA726", "#AB47BC"]
    }]
  };

  const appMemoryStats = appMemory ? {
    labels: ["Free MB", "Used MB"],
    datasets: [{
      data: [appMemory.freeMB, appMemory.usedMB],
      backgroundColor: ["#4DB6AC", "#EF5350"]
    }]
  } : null;

  const nodeMemoryStats = memory ? {
    labels: ["Used Heap", "Free Heap", "RSS"],
    datasets: [{
      label: "Memory (MB)",
      data: [memory.heapUsedMB, memory.heapTotalMB - memory.heapUsedMB, memory.rssMB],
      backgroundColor: ["#26A69A", "#42A5F5", "#EF5350"]
    }]
  } : null;

  const cpuStats = {
    labels: ["1 min", "5 min", "15 min"],
    datasets: [{
      label: "CPU Load",
      data: cpu.map(x => x.toFixed(2)),
      backgroundColor: "#42A5F5"
    }]
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🖥️ System Performance Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">👥 User Stats</Typography>
            <Bar data={userStats} />
            <Typography sx={{ mt: 1 }}>
              Total: {userCount} | Active: {activeUsers} | Deactivated: {deactivatedUsers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">📊 App Usage</Typography>
            <Bar data={appUsage} />
            <Typography sx={{ mt: 1 }}>
              Notifications: {notificationCount} | Schedules: {scheduleCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">🧠 Memory Usage</Typography>
            {appMemoryStats ? (
              <Doughnut data={appMemoryStats} />
            ) : (
              <Typography>No memory stats available.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">⚙️ Node.js Memory</Typography>
            {nodeMemoryStats ? (
              <Bar data={nodeMemoryStats} />
            ) : (
              <Typography>No server memory stats.</Typography>
            )}
            <Typography sx={{ mt: 1 }}>Uptime: {uptime} minutes</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">🔥 CPU Load (1, 5, 15 mins)</Typography>
            <Bar data={cpuStats} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">🔐 Failed Login Attempts</Typography>
            {failedLogins.length === 0 ? (
              <Typography>No failed login attempts found.</Typography>
            ) : (
              failedLogins.map((u) => (
                <Typography key={u._id}>
                  {u.name} ({u.email}) – Attempts: {u.failedLoginAttempts}
                </Typography>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SystemPerformance;
