const mongoose = require("mongoose");

const VitalsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    heartRate: { type: String },
    bloodSugar: { type: String },
    bloodPressure: { type: String },
    glucoseLevel: { type: String },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Vitals", VitalsSchema);
