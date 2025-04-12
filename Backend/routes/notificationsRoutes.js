const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Get all notifications for logged-in user
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Mark all notifications as read
router.post("/mark-read/:userId", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId }, { read: true });
    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("❌ Error marking notifications as read:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Respond to a caregiver request (Accept/Reject)
router.post("/respond/:notificationId", verifyToken, async (req, res) => {
  const { accept } = req.body;

  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    // Make sure current user is the recipient of the notification
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ On accept: link elderly to caregiver
    if (accept) {
      const caregiver = await User.findById(notification.senderId);
      if (!caregiver || caregiver.role !== "caregiver") {
        return res.status(400).json({ message: "Caregiver not found or invalid." });
      }

      // Add elderly to caregiver's assigned list
      if (!caregiver.assignedElderly.includes(req.user.id)) {
        caregiver.assignedElderly.push(req.user.id);
        await caregiver.save();
      }

      const elderlyUser = await User.findById(req.user.id);
      if (!elderlyUser.assignedCaregiver) {
        elderlyUser.assignedCaregiver = caregiver._id;
        await elderlyUser.save();
      }


      // Optional: Set caregiver as emergency contact
      const user = await User.findById(req.user.id);
      const alreadyExists = user.emergencyContacts.some(ec => ec.phone === caregiver.phone);
      if (!alreadyExists) {
        user.emergencyContacts.push({
          name: caregiver.name,
          phone: caregiver.phone || "N/A",
          relationship: "Primary Caregiver",
        });
        await user.save();
      }
    }

    // Remove notification
    await Notification.findByIdAndDelete(notification._id);

    res.json({ message: accept ? "Request accepted!" : "Request rejected." });
  } catch (error) {
    console.error("❌ Error responding to caregiver request:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Send test notification (optional)
router.post("/test", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newNotification = new Notification({
      userId,
      message,
      read: false,
    });

    await newNotification.save();

    res.json({ message: "Test notification sent!", newNotification });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🚨 Send emergency alert to caregiver + family + elderly
router.post("/emergency-alert/:elderlyId", verifyToken, async (req, res) => {
  try {
    const elderly = await User.findById(req.params.elderlyId)
      .populate("assignedCaregiver assignedFamilyMember");

    if (!elderly || elderly.role !== "elderly") {
      return res.status(404).json({ message: "Elderly user not found" });
    }

    const recipients = [];

    // Notify Caregiver
    if (elderly.assignedCaregiver) {
      recipients.push({
        userId: elderly.assignedCaregiver._id,
        title: "🚨 Emergency Alert",
        message: `${elderly.name} triggered an emergency alert!`,
      });
    }

    // Notify Family Member
    if (elderly.assignedFamilyMember) {
      recipients.push({
        userId: elderly.assignedFamilyMember._id,
        title: "🚨 Emergency Alert",
        message: `${elderly.name} triggered an emergency alert!`,
      });
    }

    recipients.push({
      userId: elderly._id,
      title: "🔔 Emergency Alert Sent",
      message: "Your emergency alert has been dispatched to your caregiver and family.",
    });

    const created = await Notification.insertMany(
      recipients.map((r) => ({
        userId: r.userId,
        title: r.title,
        message: r.message,
        type: "emergency",
        read: false,
      }))
    );

    res.status(200).json({ message: "Emergency alert sent", notifications: created });
  } catch (err) {
    console.error("❌ Failed to send emergency alert:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
