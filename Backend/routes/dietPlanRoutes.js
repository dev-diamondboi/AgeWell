const express = require("express");
const router = express.Router();
const DietPlan = require("../models/DietPlan");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Get Diet Plan (Elderly, Family & Healthcare can view, Caregiver can manage)
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const dietPlan = await DietPlan.find({ userId: req.params.userId });
    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Create Diet Plan (Caregivers only)
router.post("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { meal, time, notes } = req.body;
    const newDiet = new DietPlan({
      userId: req.params.userId,
      meal,
      time,
      notes
    });

    await newDiet.save();
    res.status(201).json({ message: "Diet plan added!", newDiet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update Diet Plan (Caregivers only)
router.put("/:userId/:dietId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedDiet = await DietPlan.findByIdAndUpdate(
      req.params.dietId,
      { $set: req.body },
      { new: true }
    );

    res.json({ message: "Diet plan updated!", updatedDiet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete Diet Plan (Caregivers only)
router.delete("/:userId/:dietId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ message: "Access denied" });
    }

    await DietPlan.findByIdAndDelete(req.params.dietId);
    res.json({ message: "Diet plan deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
