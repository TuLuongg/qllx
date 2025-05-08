const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  tenLaiXe: {
    type: String,
    required: true,
  },
  bienSoXe: {
    type: String,
    required: true,
  },
  tenKhachHang: {
    type: String,
    required: true,
  },
  giayTo: {
    type: String,
  },
  noiDi: {
    type: String,
    required: true,
  },
  noiDen: {
    type: String,
    required: true,
  },
  trongLuongHang: {
    type: Number,
  },
  soDiem: {
    type: Number,
  },
  haiChieuVaLuuCa: {
    type: String,
  },
  an: {
    type: Number,
    default: 0,
  },
  tangCa: {
    type: Number,
    default: 0,
  },
  bocXep: {
    type: Number,
    default: 0,
  },
  ve: {
    type: Number,
    default: 0,
  },
  tienChuyen: {
    type: Number,
    default: 0,
  },
  chiPhiKhac: {
    type: Number,
    default: 0,
  },
  ghiChu: {
    type: String,
  },
  ngayThangNam: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
