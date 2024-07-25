import React, { useState, useEffect } from "react";
import "../../styles/layouts/main.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Admin from "../../pages/Admin";
import AdminRoute from "../Admin/AdminRoute";
import Project from '../Project/Project';
const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      if (location.pathname === "/" || location.pathname === "/register") {
        navigate(storedUser.role === "Admin" ? "/admin" : "/employee");
      }
    } else {
      if (location.pathname !== "/register" && location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [navigate, location.pathname]);

  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="/create" element={<Create />} />
        <Route path="/employee" element={<div>Employee Dashboard</div>} />
      </Routes>
    </main>
  );
};

export default Main;
