const express = require("express");
const CheckIn = require("../models/CheckIn");
const verifyToken = require("../middleware/authMiddleware"); // Middleware to protect routes

const router = express.Router();

// ✅ Save a Check-in
router.post("/", verifyToken, async (req, res) => {
  try {
    const { date, mood, energy, symptoms, notes } = req.body;

    const newCheckIn = new CheckIn({
      userId: req.user.id,
      date,
      mood,
      energy,
      symptoms,
      notes,
    });

    await newCheckIn.save();
    res.status(201).json({ message: "Check-in saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get User's Check-ins
router.get("/", verifyToken, async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch check-ins", error });
  }
});


module.exports = router;
