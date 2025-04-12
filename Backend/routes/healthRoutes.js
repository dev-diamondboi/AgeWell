const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Get Health Details
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update Basic Health Information
router.put("/:userId", verifyToken, async (req, res) => {
  try {
    const { age, height, weight, bloodType, allergies, medicalConditions, profilePicture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { age, height, weight, bloodType, allergies, medicalConditions, profilePicture } },
      { new: true }
    );

    res.json({ message: "Health details updated successfully!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Add New Vitals Entry (Tracking)
router.post("/:userId/vitals", verifyToken, async (req, res) => {
  try {
    const { heartRate, bloodSugar, bloodPressure, glucoseLevel } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.vitals.push({ heartRate, bloodSugar, bloodPressure, glucoseLevel });
    await user.save();

    res.json({ message: "Vitals updated successfully!", vitals: user.vitals });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
