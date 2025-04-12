import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const HealthRecords = ({ user }) => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [fields, setFields] = useState({
    chronicIllnesses: [],
    medications: [],
    surgeries: [],
    immunizations: [],
    diagnosisHistory: [],
    clinicalNotes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const canEdit = ["healthcare", "admin"].includes(loggedInUser?.role);

  useEffect(() => {
    if (user) {
      setFields({
        chronicIllnesses: user.chronicIllnesses || [],
        medications: user.medications || [],
        surgeries: user.surgeries || [],
        immunizations: user.immunizations || [],
        diagnosisHistory: user.diagnosisHistory || [],
        clinicalNotes: user.clinicalNotes || "",
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFields((prev) => ({
      ...prev,
      [field]: field === "clinicalNotes" ? value : value.split(",").map(s => s.trim()),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put(`/api/users/${user._id}`, fields, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccess(true);
    } catch (err) {
      setError("Failed to update health records");
      console.error("❌ Error updating records:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        🩺 Health Records
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Health records updated!</Alert>}

      <Stack spacing={3} divider={<Divider flexItem />} sx={{ mt: 3 }}>
        <TextField
          label="Chronic Illnesses"
          value={fields.chronicIllnesses.join(", ")}
          onChange={(e) => handleChange("chronicIllnesses", e.target.value)}
          fullWidth
          disabled={!canEdit}
          helperText="Comma-separated"
        />

        <TextField
          label="Medications"
          value={fields.medications.join(", ")}
          onChange={(e) => handleChange("medications", e.target.value)}
          fullWidth
          disabled={!canEdit}
          helperText="Comma-separated"
        />

        <TextField
          label="Surgeries"
          value={fields.surgeries.join(", ")}
          onChange={(e) => handleChange("surgeries", e.target.value)}
          fullWidth
          disabled={!canEdit}
          helperText="Comma-separated"
        />

        <TextField
          label="Immunizations"
          value={fields.immunizations.join(", ")}
          onChange={(e) => handleChange("immunizations", e.target.value)}
          fullWidth
          disabled={!canEdit}
          helperText="Comma-separated"
        />

        <TextField
          label="Diagnosis History"
          value={fields.diagnosisHistory.join(", ")}
          onChange={(e) => handleChange("diagnosisHistory", e.target.value)}
          fullWidth
          disabled={!canEdit}
          helperText="Comma-separated"
        />

        <TextField
          label="Clinical Notes"
          value={fields.clinicalNotes}
          onChange={(e) => handleChange("clinicalNotes", e.target.value)}
          fullWidth
          multiline
          minRows={4}
          disabled={!canEdit}
        />
      </Stack>

      {canEdit && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Records"}
        </Button>
      )}
    </Container>
  );
};

export default HealthRecords;
