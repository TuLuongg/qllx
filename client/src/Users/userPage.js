import React, { useState } from "react";
import axios from "axios";
import maQR from "../images/maQR.jpeg";
import { useNavigate } from "react-router-dom";

const columns = [
  "Biển số xe",
  "Tên khách hàng",
  "Giấy tờ (Có/Không)",
  "Nơi đi",
  "Nơi đến",
  "Trọng lượng hàng",
  "Số điểm",
  "2 chiều & lưu ca (Ghi rõ số lượng hàng trả về)",
  "Ăn",
  "Tăng ca(Ghi giờ đi-về)",
  "Bốc xếp",
  "Vé",
  "Tiền chuyến (2+3+4+5 nếu có)",
  "Chi phí khác (Ghi rõ)",
];

function UserPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([
    { id: Date.now(), values: Array(columns.length).fill("") },
  ]);
  const [driverInfo, setDriverInfo] = useState({
    tenLaiXe: "",
    ngayDi: "", // Sửa đổi: Thêm trường ngày đi
    ngayVe: "", // Sửa đổi: Thêm trường ngày về
  });
  const [tongTienLichTrinh, setTongTienLichTrinh] = useState("");
  const [laiXeThuKhachList, setLaiXeThuKhachList] = useState([""]);
  const [phuongAnList, setPhuongAnList] = useState([""]);

  const handleDriverInfoChange = (field, value) => {
    setDriverInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (rowId, colIndex, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              values: row.values.map((v, i) => (i === colIndex ? value : v)),
            }
          : row
      )
    );
  };

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), values: Array(columns.length).fill("") },
    ]);
    setLaiXeThuKhachList([...laiXeThuKhachList, ""]);
    setPhuongAnList([...phuongAnList, ""]);
  };

  const deleteLastRow = () => {
    if (rows.length > 1) {
      setRows((prev) => prev.slice(0, -1));
      setLaiXeThuKhachList((prev) => prev.slice(0, -1));
      setPhuongAnList((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        tenLaiXe: String(driverInfo.tenLaiXe || ""),
        ngayDi: new Date(driverInfo.ngayDi).toISOString(), // Sửa đổi: Truyền ngày đi
        ngayVe: new Date(driverInfo.ngayVe).toISOString(), // Sửa đổi: Truyền ngày về
        tongTienLichTrinh: String(tongTienLichTrinh || ""),
        rows: rows.map((row, index) => ({
          values: row.values.map((val) => String(val)),
          laiXeThuKhach: String(laiXeThuKhachList[index] || ""),
          phuongAn: String(phuongAnList[index] || ""),
        })),
      };
      console.log("Dữ liệu gửi đi:", payload);
      await axios.post("http://localhost:4000/api/schedules", payload);
      alert("Dữ liệu đã được gửi lên!");

      navigate("/final", { state: payload });
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi dữ liệu:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  return (
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        LỊCH TRÌNH XE CHẠY HÀNG NGÀY
      </h1>

      {/* Thông tin lái xe */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Tên lái xe:</label>
          <input
            type="text"
            className="border border-gray-400 rounded px-2 py-1 w-full"
            value={driverInfo.tenLaiXe}
            onChange={(e) => handleDriverInfoChange("tenLaiXe", e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        {/* Ngày đi */}
        <div className="flex-1 min-w-[120px]">
          <label className="block mb-1 font-semibold">Ngày đi:</label>
          <input
            type="datetime-local"
            className="border border-gray-400 rounded px-2 py-1 w-full"
            value={driverInfo.ngayDi}
            onChange={(e) => handleDriverInfoChange("ngayDi", e.target.value)}
          />
        </div>

        {/* Ngày về */}
        <div className="flex-1 min-w-[120px]">
          <label className="block mb-1 font-semibold">Ngày về:</label>
          <input
            type="datetime-local"
            className="border border-gray-400 rounded px-2 py-1 w-full"
            value={driverInfo.ngayVe}
            onChange={(e) => handleDriverInfoChange("ngayVe", e.target.value)}
          />
        </div>
      </div>

      {/* Danh sách chuyến */}
      {rows.map((row, index) => (
        <div
          key={row.id}
          className="flex flex-col md:flex-row items-start gap-6 border border-gray-300 p-4 rounded-md mb-4"
        >
          <label className="block font-medium">Chuyến {index + 1}:</label>
          {/* Các input thông tin chuyến */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 flex-1">
            {columns.map((col, i) => {
              // Ẩn cột 9 ("Ăn") và 10 ("Tăng ca") từ chuyến thứ 2 trở đi
              if (index > 0 && (i === 8 || i === 9)) {
                return null;
              }

              return (
                <div key={i} className="flex items-center gap-2 w-full">
                  <label className="text-sm font-medium w-[160px] shrink-0">
                    {col}:
                  </label>
                  <input
                    type="text"
                    value={row.values[i]}
                    onChange={(e) =>
                      handleInputChange(row.id, i, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Phần phương án + lái xe thu khách */}
          <div className="w-full md:w-64 space-y-3">
            <div>
              <label className="block font-medium">Lái xe thu khách:</label>
              <input
                type="text"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={laiXeThuKhachList[index]}
                onChange={(e) => {
                  const updated = [...laiXeThuKhachList];
                  updated[index] = e.target.value;
                  setLaiXeThuKhachList(updated);
                }}
                placeholder="Nhập tiền thu khách"
              />
            </div>

            {/* Phương án chỉ xuất hiện nếu có nhập "Lái xe thu khách" */}
            {laiXeThuKhachList[index] && (
              <div>
                <label className="block font-medium">Phương án:</label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`phuongAn-${index}`}
                    value="daChuyenKhoan"
                    checked={phuongAnList[index] === "daChuyenKhoan"}
                    onChange={(e) => {
                      const updated = [...phuongAnList];
                      updated[index] = e.target.value;
                      setPhuongAnList(updated);
                    }}
                    className="mr-2"
                  />
                  Đã chuyển khoản cho sếp
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`phuongAn-${index}`}
                    value="truVaoTongLichTrinh"
                    checked={phuongAnList[index] === "truVaoTongLichTrinh"}
                    onChange={(e) => {
                      const updated = [...phuongAnList];
                      updated[index] = e.target.value;
                      setPhuongAnList(updated);
                    }}
                    className="mr-2"
                  />
                  Trừ thanh toán lịch trình
                </label>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Nút thêm/xóa dòng */}
      <div className="mt-6 flex gap-4 flex-wrap">
        <button
          onClick={addRow}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Thêm chuyến
        </button>
        <button
          onClick={deleteLastRow}
          className="bg-red-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow"
        >
          Xóa chuyến cuối
        </button>
      </div>

      <div className="mt-5">
        <p className="text-red-600 font-semibold text-sm">
          Nếu chuyển khoản thì chuyển vào STK sau: 1212 3656 1750 11 -
          Techcombank - Đoàn Văn Thiệp
        </p>
        <p className="text-red-600 font-semibold text-sm">
          Hoặc quét mã QR sau:
        </p>
        <img src={maQR} alt="Ảnh trong src" className="w-40 h-auto ml-10" />
      </div>

      {/* Tổng tiền lịch trình */}
      <div className="mt-8 max-w-xs">
        <label className="block mb-1 font-semibold">
          Tổng tiền lịch trình:
        </label>
        <p className="text-red-600 font-semibold text-sm">
          (Lưu ý: chỉ ghi số, ví dụ 100.000 thì chỉ ghi 100)
        </p>
        <input
          type="number"
          className="border border-gray-400 rounded px-2 py-1 w-full"
          value={tongTienLichTrinh}
          onChange={(e) => setTongTienLichTrinh(e.target.value)}
          placeholder="Nhập tổng tiền"
        />
      </div>

      {/* Nút gửi */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Gửi lịch trình
        </button>
      </div>
    </div>
  );
}

export default UserPage;
