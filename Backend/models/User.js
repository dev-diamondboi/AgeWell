const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["elderly", "caregiver", "healthcare", "family", "admin"],
    required: true,
  },

  age: Number,
  height: String,
  weight: String,
  bloodType: String,
  allergies: [String],
  medicalConditions: [String],
  profilePicture: String,

  vitals: {
    heartRate: String,
    bloodPressure: String,
    bloodSugar: String,
    glucoseLevel: String,
  },
  emergencyContacts: [EmergencyContactSchema],

  chronicIllnesses: [String],
  clinicalNotes: String,
  diagnosisHistory: [String],
  immunizations: [String],
  medications: [String],
  surgeries: [String],

  assignedElderly: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignedFamilyMember: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedCaregiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["active", "deactivated"], default: "active" },
  pendingFamilyRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastLoginAt: { type: Date },
  lastFailedLoginAt: { type: Date },
  failedLoginAttempts: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", UserSchema);
