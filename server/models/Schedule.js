const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  fields: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
