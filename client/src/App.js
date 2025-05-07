import React, { useState } from "react";
import axios from "axios";

const columns = [
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
  "Tiền chuyển",
  "Chi phí khác",
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
        await axios.post("http://localhost:5000/api/schedules", {
          fields: row.values,
        });
      }
      alert("Dữ liệu đã được gửi lên!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi dữ liệu.");
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
                    type="text"
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
      </div>
    </div>
  );
}

export default App;
