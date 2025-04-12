import React, { useState, useEffect, useContext } from "react";
import { getMedicationSchedule, markMedicationTaken } from "../api/medication";
import {
  Container,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Checkbox,
  Alert,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const MedicationView = ({ userId: propUserId }) => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = propUserId || loggedInUser?._id || loggedInUser?.id;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!userId) return;

      try {
        const data = await getMedicationSchedule(userId);
        setPrescriptions(data);
        setError("");
      } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
        setError("Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [userId]);

  const handleMarkAsTaken = async (prescriptionId) => {
    try {
      await markMedicationTaken(prescriptionId);
      setPrescriptions((prev) =>
        prev.map((p) => (p._id === prescriptionId ? { ...p, taken: true } : p))
      );
    } catch (error) {
      console.error("❌ Error marking medication as taken:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        💊 Medication Schedule
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {error && prescriptions.length === 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          {prescriptions.length === 0 ? (
            <Typography>No prescriptions available.</Typography>
          ) : (
            <List>
              {prescriptions.map((prescription, index) => (
                <ListItem key={index}>
                  <Card sx={{ width: "100%", padding: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{prescription.medicationName}</Typography>
                      <Typography variant="body2">Dosage: {prescription.dosage}</Typography>
                      <Typography variant="body2">Time: {prescription.time}</Typography>
                      <Typography variant="body2">Days: {prescription.days?.join(", ")}</Typography>

                      <Checkbox
                        checked={prescription.taken}
                        onChange={() => handleMarkAsTaken(prescription._id)}
                        disabled={prescription.taken}
                      />
                      <Typography
                        variant="body2"
                        color={prescription.taken ? "green" : "red"}
                      >
                        {prescription.taken ? "✔ Taken" : "❌ Not Taken"}
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </Container>
  );
};

export default MedicationView;
