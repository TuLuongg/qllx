import React, { useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleLogin = () => {
    if (password === "admin123") {
      setAuthorized(true);
    } else {
      alert("Sai mật khẩu!");
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/schedules/export",
        {
          responseType: "blob",
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

  const handleFilterByDate = async () => {
    if (!selectedDate) return alert("Vui lòng chọn ngày.");

    try {
      const response = await axios.get(
        `http://localhost:4000/api/schedules?ngay=${selectedDate}`
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
      await axios.delete(
        `http://localhost:4000/api/schedules?ngay=${selectedDate}`
      );
      alert("Đã xóa thành công!");
      setFilteredData([]);
    } catch (err) {
      console.error("Lỗi khi xóa dữ liệu:", err);
      alert("Không thể xóa dữ liệu theo ngày.");
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

      {/* Hiển thị dữ liệu đã lọc */}
      {filteredData.length > 0 && (
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-1">Tên lái xe</th>
              <th className="border p-1">Ngày</th>
              <th className="border p-1">Tổng tiền</th>
              <th className="border p-1">Thu khách</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                <td className="border p-1">{item.tenLaiXe}</td>
                <td className="border p-1">
                  {new Date(item.ngayThangNam).toLocaleDateString("vi-VN")}
                </td>
                <td className="border p-1">{item.tongTienLichTrinh}</td>
                <td className="border p-1">{item.laiXeThuKhach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
