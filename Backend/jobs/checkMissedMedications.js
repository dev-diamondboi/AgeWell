const Prescription = require("../models/Prescription");
const Notification = require("../models/Notification");
const User = require("../models/User");

const checkMissedMedications = async () => {
  const now = new Date();

  const missedMeds = await Prescription.find({
    taken: false,
    time: { $lte: new Date(now - 60 * 60000) } // 1 hour past due
  }).populate("userId doctorId");

  for (const med of missedMeds) {
    const elderly = med.userId;
    const caregiverId = elderly?.assignedCaregiver;

    if (caregiverId) {
      await Notification.create({
        userId: caregiverId,
        message: `🚨 ${elderly.name} missed their ${med.medicationName}! Check on them.`,
        type: "medication",
        read: false
      });
    }
  }
};

module.exports = checkMissedMedications;
