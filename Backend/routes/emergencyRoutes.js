const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware"); // 🔹 Import Role Middleware

// ✅ Get Emergency Contacts (Accessible by Caregivers, Family Members, Elderly & Admins)
router.get("/:userId", verifyToken, verifyRole(["caregiver", "elderly", "family", "admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("emergencyContacts");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.emergencyContacts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Accept Caregiver & Add to Emergency Contacts
router.post("/accept-caregiver/:caregiverId", verifyToken, async (req, res) => {
  try {
    const elderly = await User.findById(req.user.id);
    const caregiver = await User.findById(req.params.caregiverId);

    if (!elderly || elderly.role !== "elderly") return res.status(403).json({ message: "Only elderly can accept." });

    caregiver.assignedElderly = caregiver.assignedElderly || [];
    caregiver.assignedElderly.push(elderly._id);
    await caregiver.save();

    elderly.emergencyContacts.push({
      name: caregiver.name,
      phone: caregiver.phone || "N/A",
      relationship: "Assigned Caregiver",
    });
    await elderly.save();

    res.json({ message: "Caregiver assigned and added to emergency contacts!" });
  } catch (error) {
    console.error("Acceptance error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add Emergency Contact (Only Elderly Users Can Add)
router.post("/:userId", verifyToken, verifyRole(["elderly"]), async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;
    if (!name || !phone || !relationship) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.emergencyContacts.push({ name, phone, relationship });
    await user.save();

    res.status(201).json({ message: "Emergency contact added!", emergencyContacts: user.emergencyContacts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update Emergency Contact (Only Elderly Users Can Edit Their Contacts)
router.put("/:userId/:contactId", verifyToken, verifyRole(["elderly"]), async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const contact = user.emergencyContacts.id(req.params.contactId);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    contact.name = name || contact.name;
    contact.phone = phone || contact.phone;
    contact.relationship = relationship || contact.relationship;

    await user.save();
    res.json({ message: "Contact updated!", emergencyContacts: user.emergencyContacts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete Emergency Contact (Only Elderly Users Can Delete)
router.delete("/:userId/:contactId", verifyToken, verifyRole(["elderly"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.emergencyContacts = user.emergencyContacts.filter(
      (contact) => contact._id.toString() !== req.params.contactId
    );

    await user.save();
    res.json({ message: "Contact removed!", emergencyContacts: user.emergencyContacts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
