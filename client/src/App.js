import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserPage from "../src/Users/userPage";
import AdminPage from "../src/Admin/adminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<UserPage />} />{" "}
        {/* Default route (fallback) */}
      </Routes>
    </Router>
  );
}

export default App;
