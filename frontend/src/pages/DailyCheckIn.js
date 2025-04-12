import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Select, MenuItem, Button, Card, CardContent, Grid, Alert
} from "@mui/material";
import { SentimentSatisfied, SentimentDissatisfied, MoodBad, EnergySavingsLeaf } from "@mui/icons-material";
import { saveCheckIn, getCheckIns } from "../api/checkin";

const DailyCheckIn = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [checkIns, setCheckIns] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCheckIns = async () => {
      const data = await getCheckIns();
      setCheckIns(data);
    };
    fetchCheckIns();
  }, []);

  const handleSubmit = async () => {
    const newCheckIn = { date, mood, energy, symptoms, notes };
    const result = await saveCheckIn(newCheckIn);

    if (result.message === "Check-in saved successfully!") {
      setSuccessMessage("✅ Your check-in has been recorded!");
      setCheckIns([...checkIns, newCheckIn]);
      setMood(""); setEnergy(""); setSymptoms(""); setNotes("");

      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      alert(result);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: "#E3F2FD", minHeight: "100vh", padding: "30px", borderRadius: "10px" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#2E82E4", fontWeight: "bold" }}>
        📝 Daily Check-in
      </Typography>

      {successMessage && <Alert severity="success" sx={{ marginBottom: 2 }}>{successMessage}</Alert>}

      <Card sx={{ marginBottom: 3, borderRadius: "10px", backgroundColor: "#ffffff" }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Date Picker */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Select Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            {/* Mood Selection with Icons */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#2E82E4" }}>How are you feeling today?</Typography>
              <Select
                fullWidth
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                displayEmpty
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value="">Select Mood</MenuItem>
                <MenuItem value="happy">
                  <SentimentSatisfied sx={{ color: "green", marginRight: 1 }} /> 😊 Happy
                </MenuItem>
                <MenuItem value="neutral">
                  <SentimentDissatisfied sx={{ color: "orange", marginRight: 1 }} /> 😐 Neutral
                </MenuItem>
                <MenuItem value="sad">
                  <MoodBad sx={{ color: "red", marginRight: 1 }} /> 😢 Sad
                </MenuItem>
              </Select>
            </Grid>

            {/* Energy Level with Icons */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#2E82E4" }}>How is your energy level?</Typography>
              <Select
                fullWidth
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                displayEmpty
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value="">Select Energy Level</MenuItem>
                <MenuItem value="low">
                  <EnergySavingsLeaf sx={{ color: "gray", marginRight: 1 }} /> 💤 Low
                </MenuItem>
                <MenuItem value="normal">
                  <EnergySavingsLeaf sx={{ color: "blue", marginRight: 1 }} /> 🙂 Normal
                </MenuItem>
                <MenuItem value="high">
                  <EnergySavingsLeaf sx={{ color: "green", marginRight: 1 }} /> 💪 High
                </MenuItem>
              </Select>
            </Grid>

            {/* Symptoms */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#2E82E4" }}>Are you experiencing any symptoms?</Typography>
              <TextField
                fullWidth
                label="Describe any symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            {/* Additional Notes */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#2E82E4" }}>Any additional notes?</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Write anything important"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ backgroundColor: "#2E82E4", color: "#fff" }}>
                ✅ Save Check-in
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Display Past Check-ins */}
      <Typography variant="h5" sx={{ marginBottom: 2, color: "#2E82E4", fontWeight: "bold" }}>📅 Past Check-ins</Typography>
      {checkIns.length === 0 ? (
        <Typography variant="body1">No past check-ins available.</Typography>
      ) : (
        checkIns.map((checkIn, index) => (
          <Card key={index} sx={{ marginBottom: 1, borderRadius: "10px", padding: "10px", backgroundColor: "#FFF" }}>
            <CardContent>
              <Typography><strong>📆 Date:</strong> {checkIn.date}</Typography>
              <Typography><strong>😊 Mood:</strong> {checkIn.mood}</Typography>
              <Typography><strong>⚡ Energy:</strong> {checkIn.energy}</Typography>
              <Typography><strong>🤒 Symptoms:</strong> {checkIn.symptoms}</Typography>
              <Typography><strong>📝 Notes:</strong> {checkIn.notes}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default DailyCheckIn;
