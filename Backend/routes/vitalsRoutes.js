const express = require("express");
const router = express.Router();
const Vitals = require("../models/Vitals");
const verifyToken = require("../middleware/authMiddleware");

// ✅ GET user vitals
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const vitals = await Vitals.findOne({ userId: req.params.userId });
    if (!vitals) return res.status(404).json({ message: "Vitals not found" });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/history/:userId", verifyToken, async (req, res) => {
  try {
    const vitals = await Vitals.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vitals history", error });
  }
});


// ✅ UPDATE or CREATE user vitals
router.put("/:userId", verifyToken, async (req, res) => {
  try {
    console.log("🔄 Received update request for user:", req.params.userId, req.body.vitals);

    const updatedVitals = await Vitals.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body.vitals },
      { new: true, upsert: true } // ✅ Creates vitals if they don’t exist
    );

    console.log("✅ Vitals successfully updated:", updatedVitals);
    res.json({ message: "Vitals updated successfully!", updatedVitals });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
