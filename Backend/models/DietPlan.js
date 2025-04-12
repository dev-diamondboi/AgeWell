const mongoose = require("mongoose");

const DietPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meal: { type: String, required: true },
  time: { type: String, required: true }, // Format: HH:MM
  notes: { type: String }, // Optional additional meal details
});

module.exports = mongoose.model("DietPlan", DietPlanSchema);
