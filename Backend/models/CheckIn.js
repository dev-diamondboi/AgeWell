const mongoose = require("mongoose");

const CheckInSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    mood: { type: String },
    energy: { type: String },
    symptoms: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckIn", CheckInSchema);
