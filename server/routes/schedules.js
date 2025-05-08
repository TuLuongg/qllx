const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Hàm chuyển mảng fields thành object khớp schema
const mapFieldsToSchema = (fields, ngayThangNam) => {
  return {
    tenLaiXe: fields[0],
    bienSoXe: fields[1],
    tenKhachHang: fields[2],
    giayTo: fields[3],
    noiDi: fields[4],
    noiDen: fields[5],
    trongLuongHang: Number(fields[6]) || 0,
    soDiem: Number(fields[7]) || 0,
    haiChieuVaLuuCa: fields[8],
    an: Number(fields[9]) || 0,
    tangCa: Number(fields[10]) || 0,
    bocXep: Number(fields[11]) || 0,
    ve: Number(fields[12]) || 0,
    tienChuyen: Number(fields[13]) || 0,
    chiPhiKhac: Number(fields[14]) || 0,
    ghiChu: fields[15] || "",
    ngayThangNam: new Date(ngayThangNam),
  };
};

// Tạo mới lịch trình
router.post("/", async (req, res) => {
  try {
    const { fields, ngayThangNam } = req.body;
    const data = mapFieldsToSchema(fields, ngayThangNam);
    const schedule = new Schedule(data);
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

// ✅ Xuất Excel
router.get("/export", async (req, res) => {
  try {
    const schedules = await Schedule.find();

    const data = schedules.map((s) => ({
      "Tên lái xe": s.tenLaiXe,
      "Biển số xe": s.bienSoXe,
      "Tên khách hàng": s.tenKhachHang,
      "Giấy tờ": s.giayTo,
      "Nơi đi": s.noiDi,
      "Nơi đến": s.noiDen,
      "Trọng lượng hàng": s.trongLuongHang,
      "Số điểm": s.soDiem,
      "2 chiều & Lưu ca": s.haiChieuVaLuuCa,
      Ăn: s.an,
      "Tăng ca": s.tangCa,
      "Bốc xếp": s.bocXep,
      Vé: s.ve,
      "Tiền chuyến": s.tienChuyen,
      "Chi phí khác": s.chiPhiKhac,
      "Ghi chú": s.ghiChu,
      Ngày: s.ngayThangNam.toLocaleDateString("vi-VN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch Trình");

    const filePath = path.join(__dirname, "../lich_trinh.xlsx");
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, "lich_trinh.xlsx", (err) => {
      if (err) {
        console.error("Lỗi gửi file:", err);
        res.status(500).send("Lỗi gửi file");
      } else {
        fs.unlinkSync(filePath); // Xóa sau khi gửi
      }
    });
  } catch (err) {
    console.error("Lỗi export:", err);
    res.status(500).json({ error: "Xuất file thất bại" });
  }
});

module.exports = router;
