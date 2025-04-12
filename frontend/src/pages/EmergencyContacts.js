import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import {
  Container, Typography, Button, Card, CardContent,
  TextField, Grid, Alert, IconButton, Tooltip
} from "@mui/material";
import { Delete, Call, WarningAmber } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const EmergencyContacts = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchContacts = async () => {
    try {
      const res = await api.get(`/api/emergency/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to load emergency contacts.");
    }
  };

  useEffect(() => {
    if (user?.id) fetchContacts();
  }, [user, token]);

  const handleAddContact = async () => {
    try {
      const res = await api.post(`/api/emergency/${user.id}`, newContact, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewContact({ name: "", phone: "", relationship: "" });
      setSuccess("Contact added successfully.");
      fetchContacts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding contact:", err);
      setError("Failed to add contact.");
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await api.delete(`/api/emergency/${user.id}/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Contact deleted.");
      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact:", err);
      setError("Failed to delete contact.");
    }
  };

  const triggerEmergencyAlert = async () => {
    try {
      await api.post(`/api/notifications/emergency-alert/${user.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Emergency alert sent!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to send emergency alert:", err);
      setError("Could not send emergency alert.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Emergency Contacts
      </Typography>

      <Tooltip title="Trigger Emergency Alert">
        <IconButton
          onClick={triggerEmergencyAlert}
          sx={{
            color: "#fbc02d",
            backgroundColor: "#fff3cd",
            border: "2px solid #fbc02d",
            marginBottom: 2,
            float: "right"
          }}
        >
          <WarningAmber fontSize="large" />
        </IconButton>
      </Tooltip>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            fullWidth
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone"
            fullWidth
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Relationship"
            fullWidth
            value={newContact.relationship}
            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleAddContact} sx={{ mr: 2 }}>
            Add Contact
          </Button>
          <Button variant="outlined" onClick={fetchContacts}>
            Load Contacts
          </Button>
        </Grid>
      </Grid>

      {contacts.map((contact) => (
        <Card key={contact._id} sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Typography variant="h6">{contact.name}</Typography>
              <Typography>{contact.phone}</Typography>
              <Typography variant="body2" color="text.secondary">{contact.relationship}</Typography>
            </div>
            <div>
              <IconButton component="a" href={`tel:${contact.phone}`} color="primary">
                <Call />
              </IconButton>
              <IconButton onClick={() => handleDeleteContact(contact._id)} color="error">
                <Delete />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default EmergencyContacts;
