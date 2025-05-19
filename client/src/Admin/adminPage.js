import React, { useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleLogin = () => {
    if (password === "admin123") {
      setAuthorized(true);
    } else {
      alert("Sai mật khẩu!");
    }
  };

  const handleExport = async () => {
    if (!selectedDate) return alert("Vui lòng chọn ngày.");

    try {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      const response = await axios.get(
        "https://qllx.onrender.com/api/schedules/export",
        {
          params: { ngay: formattedDate },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const [year, month, day] = formattedDate.split("-");
      const fileName = `lichtrinh_${day}_${month}_${year}.xlsx`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi khi tải file Excel:", error);
      alert("Không thể tải file Excel.");
    }
  };

  const handleFilterByDate = async () => {
    if (!selectedDate) return alert("Vui lòng chọn ngày.");

    try {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      const response = await axios.get(
        `https://qllx.onrender.com/api/schedules?ngay=${formattedDate}`
      );
      setFilteredData(response.data);
    } catch (err) {
      console.error("Lỗi khi lọc dữ liệu:", err);
      alert("Không thể lấy dữ liệu theo ngày.");
    }
  };

  const handleDeleteByDate = async () => {
    if (!selectedDate) return alert("Vui lòng chọn ngày.");
    if (
      !window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch trình ngày này?")
    )
      return;

    try {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      await axios.delete(
        `https://qllx.onrender.com/api/schedules?ngay=${formattedDate}`
      );
      alert("Đã xóa thành công!");
      setFilteredData([]);
    } catch (err) {
      console.error("Lỗi khi xóa dữ liệu:", err);
      alert("Không thể xóa dữ liệu theo ngày.");
    }
  };

  const handleFilterByRange = async () => {
    if (!startDate || !endDate)
      return alert("Vui lòng chọn đủ ngày bắt đầu và kết thúc.");

    try {
      const from = new Date(startDate).toISOString().split("T")[0];
      const to = new Date(endDate).toISOString().split("T")[0];
      const response = await axios.get(
        `https://qllx.onrender.com/api/schedules/range?from=${from}&to=${to}`
      );
      setFilteredData(response.data);
    } catch (err) {
      console.error("Lỗi khi lọc theo khoảng ngày:", err);
      alert("Không thể lấy dữ liệu theo khoảng ngày.");
    }
  };

  const handleDeleteByRange = async () => {
    if (!startDate || !endDate) return alert("Vui lòng chọn đủ ngày.");

    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa toàn bộ lịch trình trong khoảng ngày này?"
      )
    )
      return;

    try {
      const from = new Date(startDate).toISOString().split("T")[0];
      const to = new Date(endDate).toISOString().split("T")[0];
      await axios.delete(
        `https://qllx.onrender.com/api/schedules/range?from=${from}&to=${to}`
      );
      alert("Đã xóa thành công!");
      setFilteredData([]);
    } catch (err) {
      console.error("Lỗi khi xóa dữ liệu theo khoảng ngày:", err);
      alert("Không thể xóa dữ liệu.");
    }
  };

  const handleExportByRange = async () => {
    if (!startDate || !endDate) return alert("Vui lòng chọn đủ ngày.");

    try {
      const from = new Date(startDate).toISOString().split("T")[0];
      const to = new Date(endDate).toISOString().split("T")[0];

      const response = await axios.get(
        `https://qllx.onrender.com/api/schedules/export-range`,
        {
          params: { from, to },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = `lichtrinh_tu_${from}_den_${to}.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi khi tải file Excel theo khoảng ngày:", error);
      alert("Không thể tải file Excel.");
    }
  };

  if (!authorized) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Đăng nhập Admin</h2>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trang Quản Lý (Admin)</h1>

      <div className="mb-4">
        <span className="font-semibold mr-4">Chọn kiểu lọc:</span>
        <label className="mr-4">
          <input
            type="radio"
            name="filter"
            value="single"
            checked={filterType === "single"}
            onChange={() => setFilterType("single")}
          />{" "}
          Theo ngày
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="range"
            checked={filterType === "range"}
            onChange={() => setFilterType("range")}
          />{" "}
          Theo khoảng ngày
        </label>
      </div>

      {filterType === "single" && (
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            onClick={handleFilterByDate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Lọc theo ngày
          </button>
          <button
            onClick={handleDeleteByDate}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Xóa theo ngày
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Tải Excel
          </button>
        </div>
      )}

      {filterType === "range" && (
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div>
            <label className="mr-2">Từ:</label>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="mr-2">Đến:</label>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleFilterByRange}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Lọc khoảng ngày
          </button>
          <button
            onClick={handleDeleteByRange}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Xóa khoảng ngày
          </button>
          <button
            onClick={handleExportByRange}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Tải Excel khoảng ngày
          </button>
        </div>
      )}

      {/* Hiển thị kết quả lọc */}
      {filteredData.length > 0 && (
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-1">STT</th>
              <th className="border p-1">Tên lái xe</th>
              <th className="border p-1">Ngày đi</th>
              <th className="border p-1">Tổng tiền lịch trình</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item._id}>
                <td className="border p-1 text-center">{index + 1}</td>
                <td className="border p-1">{item.tenLaiXe}</td>
                <td className="border p-1">
                  {(() => {
                    const date = new Date(item.ngayDi);
                    const day = String(date.getUTCDate()).padStart(2, "0");
                    const month = String(date.getUTCMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const year = date.getUTCFullYear();
                    return `${day}/${month}/${year}`;
                  })()}
                </td>
                <td className="border p-1">{item.tongTienLichTrinh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
