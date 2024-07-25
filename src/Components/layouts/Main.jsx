import React, { useState, useEffect } from "react";
import "../../styles/layouts/main.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgetPassword from "../../pages/ForgetPassword";
import ResetPassword from "../../pages/ResetPassword"; // Import trang ResetPassword
import Admin from "../../pages/Admin";
import AdminRoute from "../Admin/AdminRoute";

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      navigate(storedUser.role === "Admin" ? "/admin" : "/employee");
    } else {
      if (
        location.pathname !== "/register" &&
        location.pathname !== "/forget-password" &&
        location.pathname !== "/reset-password"
      ) {
        navigate("/");
      }
    }
  }, [navigate, location.pathname]);

  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/admin"
          element={
            user?.role === "Admin" ? (
              <AdminRoute user={user}>
                <Admin />
              </AdminRoute>
            ) : (
              <Login setUser={setUser} />
            )
          }
        />
        <Route
          path="/create"
          element={user ? <Create /> : <Login setUser={setUser} />}
        />
        <Route
          path="/employee"
          element={
            user ? <div>Employee Dashboard</div> : <Login setUser={setUser} />
          }
        />
      </Routes>
    </main>
  );
};

export default Main;
