const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Get prescriptions by userId
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.params.userId });
    res.json(prescriptions);
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Create prescription (Healthcare only)
router.post("/user/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "healthcare") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { medicationName, dosage, time, days, notificationMethod } = req.body;

    // Validate required fields
    if (!medicationName || !dosage || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPrescription = new Prescription({
      userId: req.params.userId,
      doctorId: req.user.id, // ✅ From token
      medicationName,
      dosage,
      time,
      days,
      notificationMethod,
      createdBy: req.user.id
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription added!", newPrescription });
  } catch (error) {
    console.error("❌ Error creating prescription:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Update prescription (Healthcare only)
router.put("/user/:userId/:prescriptionId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "healthcare") {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Prescription.findByIdAndUpdate(
      req.params.prescriptionId,
      { $set: req.body },
      { new: true }
    );

    res.json({ message: "Prescription updated!", updated });
  } catch (error) {
    console.error("❌ Error updating prescription:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete prescription (Healthcare only)
router.delete("/user/:userId/:prescriptionId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "healthcare") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Prescription.findByIdAndDelete(req.params.prescriptionId);
    res.json({ message: "Prescription deleted!" });
  } catch (error) {
    console.error("❌ Error deleting prescription:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Elderly marking as taken
router.put("/mark-taken/:prescriptionId", verifyToken, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.prescriptionId);
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });

    prescription.taken = true;
    await prescription.save();
    res.json({ message: "Medication marked as taken" });
  } catch (error) {
    console.error("❌ Error marking medication:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
