const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  time: {
    type: String, // Format: HH:MM
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdByRole: {
    type: String,
    enum: ["caregiver", "healthcare"],
    required: true
  }
}, {
  timestamps: true // ✅ adds createdAt and updatedAt for better sorting/records
});

// Optional index if you need fast lookups for userId + date
ScheduleSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("Schedule", ScheduleSchema);
