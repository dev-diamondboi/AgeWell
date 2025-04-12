const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Recipient
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who sent the request (optional)
  message: { type: String, required: true },
  title: { type: String },
  type: {
    type: String,
    enum: ["info", "caregiver_request", "family_request", "system", "emergency", "medication"], 
    default: "info"
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);
