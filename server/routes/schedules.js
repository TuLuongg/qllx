const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");

// Tạo mới lịch trình
router.post("/", async (req, res) => {
  try {
    const schedule = new Schedule({ fields: req.body.fields });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy tất cả lịch trình
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
