import React, { useState, useEffect } from "react";
import api from "../api";
import HealthRecords from "./HealthRecords";
import TrendsChart from "./TrendsChart"; // (You'll create this separately)
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tabs,
  Tab,
  Box
} from "@mui/material";
import { ExpandMore, Person, CloudUpload } from "@mui/icons-material";

const HealthDetails = ({ user }) => {
  const [healthInfo, setHealthInfo] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    bloodType: "",
    allergies: [],
    medicalConditions: [],
    profilePicture: "",
    vitals: {
      heartRate: "",
      bloodPressure: "",
      bloodSugar: "",
      glucoseLevel: "",
    },
  });
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [vitalsMessage, setVitalsMessage] = useState("");
  const token = localStorage.getItem("token");
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        const res = await api.get(`/api/health/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHealthInfo({
          ...res.data,
          vitals: res.data.vitals || {
            heartRate: "",
            bloodPressure: "",
            bloodSugar: "",
            glucoseLevel: "",
          },
          allergies: res.data.allergies || [],
          medicalConditions: res.data.medicalConditions || []
        });
      } catch (error) {
        console.error("Error fetching health info:", error);
        setError("Failed to load health details.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchHealthInfo();
  }, [userId, token]);

  const updateHealthInfo = async () => {
    if (!userId) {
      setError("User information is missing.");
      return;
    }

    try {
      await api.put(
        `/api/health/${userId}`,
        {
          age: healthInfo.age,
          height: healthInfo.height,
          weight: healthInfo.weight,
          bloodType: healthInfo.bloodType,
          allergies: healthInfo.allergies,
          medicalConditions: healthInfo.medicalConditions,
          profilePicture: healthInfo.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Health details updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating health info:", error);
      setError("Failed to update health details.");
    }
  };

  const updateVitals = async () => {
    try {
      await api.put(`/api/vitals/${userId}`, { vitals: healthInfo.vitals }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVitalsMessage("Vitals updated successfully!");
      setTimeout(() => setVitalsMessage(""), 3000);
    } catch (error) {
      console.error("Error updating vitals:", error);
      setVitalsMessage("Failed to update vitals.");
    }
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setHealthInfo({ ...healthInfo, profilePicture: imageUrl });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", padding: "20px", backgroundColor: "#E3F2FD", borderRadius: "10px" }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>🏥 Health Summary</Typography>
        <Avatar src={healthInfo.profilePicture || ""} sx={{ width: 60, height: 60, backgroundColor: "#90CAF9" }}>
          {!healthInfo.profilePicture && <Person fontSize="large" />}
        </Avatar>
      </Grid>

      <input type="file" accept="image/*" onChange={handlePictureUpload} style={{ display: "none" }} id="file-upload" />
      <label htmlFor="file-upload">
        <IconButton component="span" color="primary"><CloudUpload /></IconButton>
      </label>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
        <Tab label="Basic Info" />
        <Tab label="Vitals" />
        <Tab label="Health Records" />
        <Tab label="Trends" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && (
          <Card sx={{ mt: 2, borderRadius: "10px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Basic Info</Typography>
              <TextField fullWidth label="Full Name" value={healthInfo.name} onChange={(e) => setHealthInfo({ ...healthInfo, name: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Age (years)" value={healthInfo.age} onChange={(e) => setHealthInfo({ ...healthInfo, age: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Height (cm)" value={healthInfo.height} onChange={(e) => setHealthInfo({ ...healthInfo, height: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Weight (kg)" value={healthInfo.weight} onChange={(e) => setHealthInfo({ ...healthInfo, weight: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Blood Type (e.g. A+, B-, O+)" value={healthInfo.bloodType} onChange={(e) => setHealthInfo({ ...healthInfo, bloodType: e.target.value })} sx={{ mb: 2 }} />
              <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={updateHealthInfo}>
                Save Health Details
              </Button>
            </CardContent>
          </Card>
        )}

        {tab === 1 && (
          <Accordion expanded>
            <AccordionSummary expandIcon={<ExpandMore />}><Typography variant="h6">Vitals Overview</Typography></AccordionSummary>
            <AccordionDetails>
              {vitalsMessage && <Alert severity="info" sx={{ mb: 2 }}>{vitalsMessage}</Alert>}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Heart Rate (bpm)" value={healthInfo.vitals.heartRate} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, heartRate: e.target.value } })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Blood Pressure (mmHg)" value={healthInfo.vitals.bloodPressure} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, bloodPressure: e.target.value } })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Blood Sugar (mg/dL)" value={healthInfo.vitals.bloodSugar} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, bloodSugar: e.target.value } })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Glucose Level (mg/dL)" value={healthInfo.vitals.glucoseLevel} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, glucoseLevel: e.target.value } })} />
                </Grid>
              </Grid>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={updateVitals}>Save Vitals</Button>
            </AccordionDetails>
          </Accordion>
        )}

        {tab === 2 && <HealthRecords user={user} />}
        {tab === 3 && <TrendsChart user={user} />}
      </Box>
    </Container>
  );
};

export default HealthDetails;
