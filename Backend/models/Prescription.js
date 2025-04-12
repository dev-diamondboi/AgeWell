const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Healthcare Professional
  medicationName: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: String, required: true }, // "08:00 AM"
  days: [{ type: String }], // ["Monday", "Wednesday", "Friday"]
  notificationMethod: { type: String, enum: ["email", "sms", "web"], default: "web" }, 
  taken: { type: Boolean, default: false },  // ✅ New field: Has it been taken?
  takenAt: { type: Date },  // ✅ Timestamp for when it was taken
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
