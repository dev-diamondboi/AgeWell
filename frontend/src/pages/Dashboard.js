import React from "react";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { Favorite, EventNote, Medication, Contacts } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Medication Reminder",
      description: "View your scheduled medications.",
      icon: <Medication sx={{ fontSize: 40, color: "#F57C00" }} />,
      buttonText: "GO TO MEDICATIONS",
      path: "/medication-view",
    },
    {
      title: "Health Details",
      description: "View current vitals and records.",
      icon: <Favorite sx={{ fontSize: 40, color: "#D32F2F" }} />,
      buttonText: "VIEW HEALTH",
      path: "/health-details",
    },
    {
      title: "Daily Check-in",
      description: "Track your daily health activities.",
      icon: <EventNote sx={{ fontSize: 40, color: "#1976D2" }} />,
      buttonText: "START CHECK-IN",
      path: "/daily-checkin",
    },
    {
      title: "Emergency Contact",
      description: "View & set emergency contacts.",
      icon: <Contacts sx={{ fontSize: 40, color: "#D32F2F" }} />,
      buttonText: "VIEW CONTACTS",
      path: "/emergency-contacts",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E3F2FD",
        padding: 4,
      }}
    >
      <Card sx={{ width: "100%", padding: 4, textAlign: "center", backgroundColor: "#FFF" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#2E82E4", marginBottom: 3 }}>
          📋 Elderly Dashboard
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 3,
                  height: "100%",
                  borderRadius: "15px",
                  boxShadow: "2px 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                {item.icon}
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    {item.description}
                  </Typography>
                  <Button variant="outlined" fullWidth onClick={() => navigate(item.path)}>
                    {item.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Container>
  );
};

export default Dashboard;
