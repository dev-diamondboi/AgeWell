import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
} from "@mui/material";
import PublicNavbar from "../components/PublicNavbar";
import { Link } from "react-router-dom";

const mockHealthData = {
  name: "Jane Doe",
  age: 78,
  heartRate: "82 bpm",
  bloodPressure: "120/80 mmHg",
  medications: ["Aspirin", "Metformin"],
};

const DemoDashboard = () => {
  return (
    <>
      <PublicNavbar />

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          👋 Welcome to Demo Mode
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Explore how AgeWell works — no login required. The features shown below represent the real experience you get with a subscription.
        </Typography>

        {/* App Overview */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📱 What is AgeWell?
            </Typography>
            <Typography>
              AgeWell is a smart elderly care platform built for families, caregivers, and healthcare professionals. It allows you to:
            </Typography>
            <ul>
              <li>Track vitals like heart rate and blood pressure over per check-ups</li>
              <li>Receive automatic medication reminders</li>
              <li>Conduct daily check-ins and wellness surveys</li>
              <li>Manage caregiver schedules and diet plans</li>
              <li>Access emergency contacts instantly</li>
              <li>Securely store and access medical records</li>
              <li>Support family involvement and alerts for critical health changes</li>
              <li>Enable doctors to review prescriptions and schedule appointments</li>
              <li>Give administrators oversight on performance and security</li>
            </ul>
            <Typography sx={{ mt: 2 }}>
              Everything is HIPAA & GDPR compliant to ensure the highest data security.
            </Typography>
          </CardContent>
        </Card>

        {/* Simulated Screens */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Elderly Daily Check-in
                </Typography>
                <Typography>Mood: 😊 Good</Typography>
                <Typography>Energy Level: Moderate</Typography>
                <Button disabled variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Submit Check-In (Demo Mode)
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health Vitals
                </Typography>
                <Typography>Heart Rate: {mockHealthData.heartRate}</Typography>
                <Typography>Blood Pressure: {mockHealthData.bloodPressure}</Typography>
                <Button disabled variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Update Vitals (Demo Mode)
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Caregiver Dashboard
                </Typography>
                <Typography>- View schedule for Jane Doe</Typography>
                <Typography>- Check medication status</Typography>
                <Typography>- Send wellness message</Typography>
                <Button disabled variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Access Dashboard (Demo Mode)
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Family Notifications
                </Typography>
                <Typography>- Jane's vitals are normal today</Typography>
                <Typography>- No medications missed</Typography>
                <Typography>- Emergency alerts: None</Typography>
                <Button disabled variant="outlined" fullWidth sx={{ mt: 2 }}>
                  View Health Summary (Demo Mode)
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Medical Records (Doctor View)
                </Typography>
                <Typography>- BP trend normal</Typography>
                <Typography>- Heart rate consistent</Typography>
                <Typography>- Diet plan followed</Typography>
                <Button disabled variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Edit Records (Demo Mode)
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Medications
                </Typography>
                {mockHealthData.medications.map((med, index) => (
                  <Typography key={index}>• {med}</Typography>
                ))}
                <Button disabled variant="contained" fullWidth sx={{ mt: 2 }}>
                  Save Medications (Demo Mode)
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* CTA to Pricing Page */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ready to Get Started?
                </Typography>
                <Typography>
                  View our flexible subscription plans designed to meet every family's needs. Unlock full access to AgeWell's premium features.
                </Typography>
                <Button component={Link} to="/pricing" variant="contained" fullWidth sx={{ mt: 2 }}>
                  View Subscription Plans
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DemoDashboard;
