import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi local storage
    localStorage.removeItem("user");
    // Điều hướng về trang đăng nhập
    navigate("/Login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
