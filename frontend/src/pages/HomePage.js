import React from "react";
import {
  AppBar, Toolbar, Typography, Button, Container, Grid, Box, Card, CardMedia, CardContent
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Agewell_logo.gif";

const HomePage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const features = [
    {
      title: "👴 Caregiver Support",
      description: "Connect with caregivers for daily support, reminders, and care routines.",
      image: "/images/caregiverhelpingelderly.jpg",
    },
    {
      title: "🩺 Health Monitoring",
      description: "Track vitals, medication schedules, and receive health alerts.",
      image: "/images/medicon.jpg",
    },
    {
      title: "📱 Family Communication",
      description: "Keep family updated through phone/video calls and health updates.",
      image: "/images/elderlyfamilyphonecall.jpg",
    },
    {
      title: "💡 Simple Interface",
      description: "Elder-friendly app design with intuitive controls and large text.",
      image: "/images/elderholdingphone.jpg",
    },
    {
      title: "💳 Affordable Subscription Plans",
      description: "Monthly and yearly plans tailored to every family's needs — transparent, accessible pricing.",
      image: "/images/payment.jpg",
    },
    {
      title: "🔒 Secure & Compliant",
      description: "Built with HIPAA & GDPR compliance for secure medical record management and privacy.",
      image: "/images/medcompliance.jpg",
    },
  ];

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
    { label: "Demo Mode", path: "/demo" },
    { label: "Login", path: "/login" },
  ];

  return (
    <>
      {/* 🔷 Top Navigation Bar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src={logo} alt="AgeWell Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography variant="h6" fontWeight="bold">AgeWell</Typography>
          </Box>

          {navItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              sx={{ textDecoration: pathname === item.path ? "underline" : "none" }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {/* 🔷 Hero + Feature Section */}
      <Container sx={{ mt: 6 }}>
        <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
          Welcome to AgeWell
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" mb={4}>
          Empowering the elderly and their families with compassionate digital care.
        </Typography>

        <Grid container spacing={4}>
          {features.map((item, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card sx={{ height: "100%", borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={6}>
          <Typography variant="h5" gutterBottom>
            Ready to take care further?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{ mr: 2 }}
          >
            Try Login/Register
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/demo")}
            sx={{ mr: 2 }}
          >
            Try Demo Mode
          </Button>
          
        </Box>

        {/* 🔷 Subscription Button Footer */}
        <Box textAlign="center" mt={10} mb={6}>
          <Typography variant="body1" gutterBottom>
            Curious about our plans?
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/pricing")}
          >
            Explore Pricing Options
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
