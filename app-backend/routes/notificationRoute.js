const Notification = require("../models/Notification");
const express = require("express");
const router = express.Router();
router.post("/fetch", async (req, res) => {
  const { role } = req.body;
  try {
    const notifications = await Notification.find({ role: { $eq: role } });
    console.log(notifications, role);
    res.status(200).json({ status: true, notifications: notifications });
    if (notifications.length <= 0) return;

    // Asynchronously delete notifications with status true
    Notification.deleteMany()
      .then((result) => {
        console.log(
          `Deleted ${result.deletedCount} notifications with status true.`
        );
      })
      .catch((error) => {
        console.error("Error deleting notifications:", error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
