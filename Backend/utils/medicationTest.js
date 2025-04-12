const cron = require("node-cron");

const testReminder = () => {
  console.log("🔔 Medication Reminder: Time to take your medicine!");
};

// Runs every 1 minute (for testing)
cron.schedule("* * * * *", () => {
  testReminder();
});

console.log("✅ Test medication reminder is running...");
