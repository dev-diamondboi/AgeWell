const cron = require("node-cron");
const Prescription = require("../models/Prescription");
const User = require("../models/User");
const sendPushNotification = require("./sendNotification");

// Define time slots
const timeSlots = [
  "08:00", "09:00",  // Morning
  "12:00", "13:00",  // Afternoon
  "18:00", "19:00"   // Evening
];

// ✅ Run every minute to check for medication reminders
cron.schedule("* * * * *", async () => {
  console.log("🔄 Checking for medication reminders...");

  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
  const today = now.toLocaleString("en-US", { weekday: "long" });

  if (timeSlots.includes(currentTime)) {
    try {
      const prescriptions = await Prescription.find({ time: currentTime, days: today });

      for (let prescription of prescriptions) {
        const user = await User.findById(prescription.userId);
        if (!user) continue;

        const { medicationName, dosage } = prescription;

        // ✅ Store notification in MongoDB (for UI display)
        await User.findByIdAndUpdate(user.id, {
          $push: {
            notifications: { 
              message: `💊 Take your ${medicationName} (${dosage})!`, 
              time: new Date(),
              read: false
            }
          }
        });

        // ✅ Send push notification to app
        await sendPushNotification(user.notificationToken, {
          title: "💊 Medication Reminder",
          body: `It's time to take your ${medicationName} (${dosage})!`
        });
      }
    } catch (error) {
      console.error("❌ Error sending notifications:", error);
    }
  }
});

console.log("✅ Medication reminder system is running...");
