import React, { useState } from "react";
import axios from "axios";

const columns = [
  "Tên lái xe",
  "Biển số xe",
  "Tên khách hàng",
  "Giấy tờ",
  "Nơi đi",
  "Nơi đến",
  "Trọng lượng hàng",
  "Số điểm",
  "2 chiều & Lưu ca",
  "Ăn",
  "Tăng ca",
  "Bốc xếp",
  "Vé",
  "Tiền chuyến",
  "Chi phí khác",
  "Ghi chú",
  "Ngày", // thêm cột ngày
];

function App() {
  const [rows, setRows] = useState([
    { id: Date.now(), values: Array(columns.length).fill("") },
  ]);

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
  };

  const handleSubmit = async () => {
    try {
      for (let row of rows) {
        const fields = row.values.slice(0, 16); // các trường dữ liệu
        const ngayThangNam = row.values[16]; // trường ngày

        await axios.post("https://qllx.onrender.com/api/schedules", {
          fields,
          ngayThangNam,
        });
      }
      alert("Dữ liệu đã được gửi lên!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "https://qllx.onrender.com/api/schedules/export", // sửa URL ở đây
        {
          responseType: "blob", // để nhận file dưới dạng nhị phân
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lich_trinh.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi khi tải file Excel:", error);
      alert("Không thể tải file Excel.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lịch Trình Xe Chạy Hàng Ngày</h1>
      <table className="w-full border border-collapse">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="border p-2 text-sm">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.values.map((val, i) => (
                <td key={i} className="border p-1">
                  <input
                    type={i === 16 ? "date" : "text"} // cột cuối là ngày thì dùng input date
                    value={val}
                    onChange={(e) =>
                      handleInputChange(row.id, i, e.target.value)
                    }
                    className="border p-1 w-full"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-x-2">
        <button
          onClick={addRow}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Thêm dòng
        </button>
        <button
          onClick={handleSubmit}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Gửi dữ liệu
        </button>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Tải Excel
        </button>
      </div>
    </div>
  );
}

export default App;
