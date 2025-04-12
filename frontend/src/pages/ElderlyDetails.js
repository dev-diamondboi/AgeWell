import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import Schedule from "./Schedule";
import DietPlan from "./DietPlan";
import HealthDetails from "./HealthDetails";
import MedicationView from "./MedicationView";
import ManagePrescriptions from "./ManagePrescriptions";
import { AuthContext } from "../context/AuthContext";

const ElderlyDetails = () => {
  const { id } = useParams();
  const [elderly, setElderly] = useState(null);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState(null);
  const { user: loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    if (!id) {
      setError("Invalid elderly ID in route.");
      return;
    }

    const fetchElderly = async () => {
      try {
        const res = await api.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setElderly(res.data);
      } catch (error) {
        console.error("Failed to load elderly profile", error);
        setError("Failed to fetch elderly details.");
      }
    };

    fetchElderly();
  }, [id]);

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!elderly) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography>Loading elderly profile...</Typography>
      </Container>
    );
  }

  const showPrescriptionsTab = loggedInUser?.role === "healthcare";

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        👵 Elderly Details: {elderly.name}
      </Typography>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="📅 Schedule" />
        <Tab label="🍽️ Diet Plan" />
        <Tab label="🩺 Medical History" />
        <Tab label="💊 Medications" />
        {showPrescriptionsTab && <Tab label="📋 Manage Prescriptions" />}
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && <Schedule userId={elderly._id} />}
        {tab === 1 && <DietPlan userId={elderly._id} />}
        {tab === 2 && <HealthDetails user={elderly} />}
        {tab === 3 && <MedicationView userId={elderly._id} />}
        {tab === 4 && showPrescriptionsTab && (
          <ManagePrescriptions userId={elderly._id} />
        )}
        
      </Box>
    </Container>
  );
};

export default ElderlyDetails;
