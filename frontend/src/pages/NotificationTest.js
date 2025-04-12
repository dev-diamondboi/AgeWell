import React from "react";
import axios from "axios";
import { Button, Container, Typography } from "@mui/material";

const NotificationTest = ({ userId }) => {
  const sendTestNotification = async () => {
    await axios.post("http://localhost:5000/api/notifications/send-test", { userId });
    alert("Test notification sent!");
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        🚀 Test Notifications
      </Typography>
      <Button variant="contained" color="primary" onClick={sendTestNotification}>
        Trigger Test Notification
      </Button>
    </Container>
  );
};

export default NotificationTest;
