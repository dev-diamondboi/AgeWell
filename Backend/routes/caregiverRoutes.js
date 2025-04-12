const express = require("express");
const Notification = require("../models/Notification");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Ensure only caregivers can access this
const verifyCaregiver = (req, res, next) => {
  if (!req.user || req.user.role !== "caregiver") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// ✅ Search for Elderly Users (Caregiver & Healthcare)
router.get("/search-elderly", verifyToken, async (req, res) => {
  try {
    const { query } = req.query;
    const elderlyUsers = await User.find({
      role: "elderly",
      $or: [
        { name: new RegExp(query, "i") },
        { email: new RegExp(query, "i") }
      ],
    });
    res.json(elderlyUsers);
  } catch (error) {
    console.error("❌ Error searching elderly users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Caregiver sends a request to an elderly user
router.post("/request-elderly/:elderlyId", verifyToken, verifyCaregiver, async (req, res) => {
  try {
    const elderly = await User.findById(req.params.elderlyId);
    if (!elderly || elderly.role !== "elderly") {
      return res.status(404).json({ message: "Elderly user not found." });
    }

    const caregiver = await User.findById(req.user.id);

    // Prevent duplicate requests
    const existingNotification = await Notification.findOne({
      userId: elderly._id,
      senderId: caregiver._id,
      type: "caregiver_request",
      read: false
    });

    if (existingNotification) {
      return res.status(400).json({ message: "Request already sent." });
    }

    // Send caregiver request as a notification
    const notification = new Notification({
      userId: elderly._id,
      senderId: caregiver._id,
      message: `${caregiver.name} is requesting to be assigned as your caregiver.`,
      type: "caregiver_request"
    });

    await notification.save();
    res.status(200).json({ message: "Request sent!" });
  } catch (error) {
    console.error("Error sending caregiver request:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Elderly accepts/rejects caregiver request (called from Notification)
router.post("/respond-to-request/:notificationId", verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { accept } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    const elderly = await User.findById(notification.userId);
    const caregiver = await User.findById(notification.senderId);

    if (!elderly || !caregiver) {
      return res.status(400).json({ message: "Invalid caregiver or elderly" });
    }

    // Ensure the user responding is the elderly
    if (req.user.id !== elderly._id.toString()) {
      return res.status(403).json({ message: "Only the elderly can respond to this request" });
    }

    // If accepted, add elderly to caregiver's list & update emergency contacts
    if (accept) {
      if (!caregiver.assignedElderly.includes(elderly._id)) {
        caregiver.assignedElderly.push(elderly._id);
        await caregiver.save();
      }

      // ✅ Assign caregiver as emergency contact if none exists
      if (!elderly.emergencyContacts || elderly.emergencyContacts.length === 0) {
        elderly.emergencyContacts.push({
          name: caregiver.name,
          phone: caregiver.phone || "N/A",
          relationship: "Primary Caregiver"
        });
        await elderly.save();
      }

      notification.read = true;
      await notification.save();

      return res.json({ message: "Caregiver request accepted!" });
    } else {
      // Just mark notification as read if rejected
      notification.read = true;
      await notification.save();
      return res.json({ message: "Caregiver request rejected." });
    }
  } catch (error) {
    console.error("❌ Error responding to request:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get Elderly Users Assigned to Caregiver
router.get("/my-elderly", verifyToken, verifyCaregiver, async (req, res) => {
  try {
    const caregiver = await User.findById(req.user.id).populate("assignedElderly");
    if (!caregiver) return res.status(404).json({ message: "Caregiver not found" });
    res.json(caregiver.assignedElderly);
  } catch (error) {
    console.error("❌ Error fetching assigned elderly users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
