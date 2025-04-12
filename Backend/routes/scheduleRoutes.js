const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const verifyToken = require("../middleware/authMiddleware");

// 📋 View all grouped schedules (for elderly, family, etc.)
router.get("/view-all/:userId", verifyToken, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId });

    const grouped = {
      caregiver: schedules.filter(s => s.createdByRole === "caregiver"),
      healthcare: schedules.filter(s => s.createdByRole === "healthcare"),
    };

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🔍 View schedules by role (used by caregiver/healthcare to view their own created ones)
// 🔍 Get schedules for user (role-based filtering)
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const { role } = req.user;

    const filter = { userId: req.params.userId };

    if (["caregiver", "healthcare"].includes(role)) {
      filter.createdByRole = role; // Only fetch their own created schedules
    }

    const schedules = await Schedule.find(filter);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ➕ Create schedule
router.post("/:userId", verifyToken, async (req, res) => {
  try {
    if (!["caregiver", "healthcare"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, date, time } = req.body;

    const newSchedule = new Schedule({
      userId: req.params.userId,
      title,
      description,
      date,
      time,
      createdBy: req.user.id,
      createdByRole: req.user.role,
    });

    await newSchedule.save();
    res.status(201).json({ message: "Schedule added!", newSchedule });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✏️ Update schedule
router.put("/:userId/:scheduleId", verifyToken, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.scheduleId);

    if (
      !schedule ||
      schedule.createdBy.toString() !== req.user.id ||
      schedule.createdByRole !== req.user.role
    ) {
      return res.status(403).json({ message: "Not authorized to edit this schedule" });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.scheduleId,
      { $set: req.body },
      { new: true }
    );

    res.json({ message: "Schedule updated!", updatedSchedule });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ❌ Delete schedule
router.delete("/:userId/:scheduleId", verifyToken, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.scheduleId);

    if (
      !schedule ||
      schedule.createdBy.toString() !== req.user.id ||
      schedule.createdByRole !== req.user.role
    ) {
      return res.status(403).json({ message: "Not authorized to delete this schedule" });
    }

    await Schedule.findByIdAndDelete(req.params.scheduleId);
    res.json({ message: "Schedule deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
