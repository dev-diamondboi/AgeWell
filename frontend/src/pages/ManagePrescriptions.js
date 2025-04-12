import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  getPrescriptions,
  addPrescription,
  deletePrescription,
  updatePrescription,
} from "../api/prescription";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ManagePrescriptions = ({ userId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    time: "",
    days: [],
    notificationMethod: "web",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchPrescriptions();
  }, [userId]);

  const fetchPrescriptions = async () => {
    try {
      const data = await getPrescriptions(userId);
      setPrescriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (prescription = null) => {
    if (prescription) {
      setEditMode(true);
      setEditId(prescription._id);
      setFormData({
        medicationName: prescription.medicationName,
        dosage: prescription.dosage,
        time: prescription.time,
        days: prescription.days || [],
        notificationMethod: prescription.notificationMethod || "web",
      });
    } else {
      setEditMode(false);
      setFormData({
        medicationName: "",
        dosage: "",
        time: "",
        days: [],
        notificationMethod: "web",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setFormData({
      medicationName: "",
      dosage: "",
      time: "",
      days: [],
      notificationMethod: "web",
    });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updatePrescription(userId, editId, formData);
      } else {
        await addPrescription(userId, formData);
      }
      fetchPrescriptions();
      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (prescriptionId) => {
    try {
      await deletePrescription(userId, prescriptionId);
      fetchPrescriptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckboxChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        💊 Manage Prescriptions
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
            ➕ Add Prescription
          </Button>

          <List>
            {prescriptions.map((p) => (
              <ListItem
                key={p._id}
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleOpenDialog(p)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(p._id)}><Delete /></IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={p.medicationName}
                  secondary={`Dosage: ${p.dosage} | Time: ${p.time} | Days: ${p.days.join(", ")}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Edit Prescription" : "Add Prescription"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Medication Name"
            value={formData.medicationName}
            onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Notification Method"
            value={formData.notificationMethod}
            onChange={(e) => setFormData({ ...formData, notificationMethod: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="web">Web</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="sms">SMS</MenuItem>
          </TextField>
          <Typography variant="body2" sx={{ mt: 1 }}>Days:</Typography>
          <FormGroup row>
            {daysOfWeek.map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={formData.days.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagePrescriptions;
