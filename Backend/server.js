require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cron = require("node-cron");
const checkMissedMedications = require("./jobs/checkMissedMedications");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: true, // allows all origins temporarily
  credentials: true
}));

app.use(express.json());

// ✅ Run every 50 minutes to check for missed medications
cron.schedule("*/3 * * * *", () => {
  console.log("🕒 Checking for missed medications...");
  checkMissedMedications();
});

connectDB(); // ✅ Connect to MongoDB

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/caregiver", require("./routes/caregiverRoutes"));
app.use("/api/checkin", require("./routes/checkInRoutes"));
app.use("/api/diet", require("./routes/dietPlanRoutes"));
app.use("/api/emergency", require("./routes/emergencyRoutes"));
app.use("/api/health", require("./routes/healthRoutes"));
app.use("/api/notifications", require("./routes/notificationsRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/schedule", require("./routes/scheduleRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/vitals", require("./routes/vitalsRoutes"));
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// ✅ Medication test utilities (optional)
require("./utils/medicationTest"); 
// require("./utils/medicationScheduler");

// ✅ Start the server
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;