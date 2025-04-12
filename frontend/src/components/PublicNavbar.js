import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Agewell_logo.gif";

const PublicNavbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
    { label: "Demo Mode", path: "/demo" },
    { label: "Login", path: "/login" },
  ];

  return (
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
            sx={{
              textDecoration: pathname === item.path ? "underline" : "none",
              fontWeight: pathname === item.path ? "bold" : "normal"
            }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default PublicNavbar;
