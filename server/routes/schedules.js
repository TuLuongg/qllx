const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Chuyển tất cả fields về String
const mapFieldsToRow = (fields) => {
  return {
    bienSoXe: String(fields[0] || ""),
    tenKhachHang: String(fields[1] || ""),
    giayTo: String(fields[2] || ""),
    noiDi: String(fields[3] || ""),
    noiDen: String(fields[4] || ""),
    trongLuongHang: String(fields[5] || ""),
    soDiem: String(fields[6] || ""),
    haiChieuVaLuuCa: String(fields[7] || ""),
    an: String(fields[8] || ""),
    tangCa: String(fields[9] || ""),
    bocXep: String(fields[10] || ""),
    ve: String(fields[11] || ""),
    tienChuyen: String(fields[12] || ""),
    chiPhiKhac: String(fields[13] || ""),
    laiXeThuKhach: String(rowObj.laiXeThuKhach || ""),
  };
};

// Tạo lịch trình mới
router.post("/", async (req, res) => {
  try {
    const {
      tenLaiXe,
      ngayThangNam,
      tongTienLichTrinh,
      laiXeThuKhach,
      phuongAn,
      rows,
    } = req.body;

    const processedRows = rows.map(mapFieldsToRow);

    const schedule = new Schedule({
      tenLaiXe: String(tenLaiXe || ""),
      ngayThangNam: new Date(ngayThangNam),
      tongTienLichTrinh: String(tongTienLichTrinh || ""),
      laiXeThuKhach: String(laiXeThuKhach || ""),
      phuongAn: String(phuongAn || ""),
      rows: processedRows,
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    console.error("Lỗi tạo lịch trình:", err);
    res.status(500).json({ error: err.message });
  }
});

// Lấy toàn bộ lịch trình hoặc lọc theo ngày
router.get("/", async (req, res) => {
  try {
    let query = {};

    if (req.query.ngay) {
      const start = new Date(req.query.ngay);
      const end = new Date(req.query.ngay);
      end.setDate(end.getDate() + 1);

      query.ngayThangNam = { $gte: start, $lt: end };
    }

    const schedules = await Schedule.find(query);
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xuất Excel
router.get("/export", async (req, res) => {
  try {
    let query = {};

    if (req.query.ngay) {
      const start = new Date(req.query.ngay);
      const end = new Date(req.query.ngay);
      end.setDate(end.getDate() + 1);

      query.ngayThangNam = { $gte: start, $lt: end };
    }
    const schedules = await Schedule.find();

    const data = [];

    schedules.forEach((s) => {
      let isFirstRow = true;

      s.rows.forEach((row) => {
        data.push({
          Ngày: isFirstRow ? s.ngayThangNam.toLocaleDateString("vi-VN") : "",
          "Tên lái xe": isFirstRow ? s.tenLaiXe : "",
          "Biển số xe": row.bienSoXe,
          "Tên khách hàng": row.tenKhachHang,
          "Giấy tờ": row.giayTo,
          "Nơi đi": row.noiDi,
          "Nơi đến": row.noiDen,
          "Trọng lượng hàng": row.trongLuongHang,
          "Số điểm": row.soDiem,
          "2 chiều & Lưu ca": row.haiChieuVaLuuCa,
          Ăn: row.an,
          "Tăng ca": row.tangCa,
          "Bốc xếp": row.bocXep,
          Vé: row.ve,
          "Tiền chuyến": row.tienChuyen,
          "Chi phí khác": row.chiPhiKhac,
          "Tổng tiền lịch trình": "",
          "Lái xe thu khách": row.laiXeThuKhach,
          "Phương án": "",
        });
        isFirstRow = false;
      });

      // Dòng tổng kết cuối cùng cho từng lịch trình
      data.push({
        Ngày: "",
        "Tên lái xe": "",
        "Biển số xe": "",
        "Tên khách hàng": "",
        "Giấy tờ": "",
        "Nơi đi": "",
        "Nơi đến": "",
        "Trọng lượng hàng": "",
        "Số điểm": "",
        "2 chiều & Lưu ca": "",
        Ăn: "",
        "Tăng ca": "",
        "Bốc xếp": "",
        Vé: "",
        "Tiền chuyến": "",
        "Chi phí khác": "",
        "Tổng tiền lịch trình": s.tongTienLichTrinh || "",
        "Lái xe thu khách": s.laiXeThuKhach || "",
        "Phương án":
          s.phuongAn === "daChuyenKhoan"
            ? "Đã chuyển khoản"
            : "Trừ vào tiền tổng",
      });

      // Dòng trắng ngăn cách
      data.push({});
    });

    // Chuyển dữ liệu sang Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch Trình");

    // Ghi ra file tạm
    const filePath = path.join(__dirname, "../lich_trinh.xlsx");
    XLSX.writeFile(workbook, filePath);

    // Gửi file
    res.download(filePath, "lich_trinh.xlsx", (err) => {
      if (err) {
        console.error("Lỗi gửi file:", err);
        res.status(500).send("Lỗi gửi file");
      } else {
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error("Lỗi export:", err);
    res.status(500).json({ error: "Xuất file thất bại" });
  }
});

module.exports = router;
