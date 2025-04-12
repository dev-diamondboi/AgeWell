const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notification = require("../models/Notification");
const Schedule = require("../models/Schedule");
const verifyToken = require("../middleware/authMiddleware");
const os = require("os");
const process = require("process");

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.put("/users/:userId/deactivate", verifyToken, verifyAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, { status: "deactivated" }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deactivated", user });
});

router.put("/users/:userId/reactivate", verifyToken, verifyAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, { status: "active" }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User reactivated", user });
});

router.delete("/users/:userId", verifyToken, verifyAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.userId);
  res.json({ message: "User deleted successfully" });
});

router.get("/system-metrics", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [userCount, activeUsers, deactivatedUsers, notificationCount, scheduleCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "deactivated" }),
      Notification.countDocuments(),
      Schedule.countDocuments()
    ]);

    const failedLogins = await User.find({ failedLoginAttempts: { $gt: 0 } }).select("name email failedLoginAttempts");

    const memory = {
      totalMB: Math.round(os.totalmem() / 1024 / 1024),
      freeMB: Math.round(os.freemem() / 1024 / 1024)
    };

    const appMemory = process.memoryUsage();
    const appMemoryFormatted = {
      heapUsedMB: Math.round(appMemory.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(appMemory.heapTotal / 1024 / 1024),
      rssMB: Math.round(appMemory.rss / 1024 / 1024),
      externalMB: Math.round(appMemory.external / 1024 / 1024)
    };

    const cpu = os.loadavg();
    const uptime = Math.round(process.uptime() / 60);

    res.json({
      userCount,
      activeUsers,
      deactivatedUsers,
      notificationCount,
      scheduleCount,
      memory,
      appMemory: appMemoryFormatted,
      cpu,
      uptime,
      failedLogins
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

module.exports = router;
