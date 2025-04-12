import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Box,
  Alert,
} from "@mui/material";
import api from "../api";
import PublicNavbar from "../components/PublicNavbar";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/contact", formData);
      setSnackbar({
        open: true,
        message: "✅ Message sent successfully!",
        severity: "success",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("❌ Failed to send message", error);
      setSnackbar({
        open: true,
        message: "❌ Failed to send message",
        severity: "error",
      });
    }
  };

  return (
    <>
      <PublicNavbar />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
            📩 Contact Us
          </Typography>

          <Typography variant="body1" align="center" mb={3}>
            We’d love to hear from you. Fill out the form below and we'll get back to you!
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <Button variant="contained" fullWidth type="submit">
              Send Message
            </Button>
          </form>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default ContactUs;
