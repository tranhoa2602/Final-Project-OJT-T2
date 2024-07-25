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
import EditEmployee from "../Employee/Employee_Information/EditEmployee"; // Import trang EditEmployee
import EmployeeList from "../Employee/Employee_Information/EmployeeList"; // Import trang EmployeeList
import EmployeeDetails from "../Employee/Employee_Information/EmployeeDetails"; // Import trang EmployeeDetails
import CVExport from "../Employee/Employee_Information/ExportEmployeeCV"; // Import trang CVExport

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      // Check if the current path is not one of the public paths or the appropriate user role path
      const userRolePath = storedUser.role === "Admin" ? "/admin" : "/employee";
      if (
        location.pathname !== userRolePath &&
        !["/register", "/forget-password", "/reset-password"].includes(
          location.pathname
        )
      ) {
        // No automatic navigation to user role path
      }
    } else {
      const publicPaths = ["/register", "/forget-password", "/reset-password"];
      if (!publicPaths.includes(location.pathname)) {
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
        <Route path="/create" element={<Create />} />
        <Route path="/edit" element={<EditEmployee />} />
        <Route path="/list" element={<EmployeeList />} />
        <Route path="/details" element={<EmployeeDetails />} />
        <Route path="/employee" element={<div>Employee Dashboard</div>} />
        <Route path="/exportcv" element={<CVExport />} />
      </Routes>
    </main>
  );
};

export default Main;
