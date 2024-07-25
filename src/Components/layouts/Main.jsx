import React, { useState, useEffect } from "react";
import "../../styles/layouts/main.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgetPassword from "../../pages/ForgetPassword"; // Import trang ForgetPassword
import Admin from "../../pages/Admin";
import AdminRoute from "../Admin/AdminRoute";
import EditEmployee from "../Employee/Employee_Information/EditEmployee";
import EmployeeList from "../Employee/Employee_Information/EmployeeList";
import EmployeeDetails from "../Employee/Employee_Information/EmployeeDetails";
import CVExport from "../Employee/Employee_Information/ExportEmployeeCV";

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      if (
        location.pathname !== "/register" &&
        location.pathname !== "/forget-password"
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
        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="/create" element={<Create />} />
        <Route path="/edit" element={<EditEmployee></EditEmployee>}></Route>
        <Route path="/list" element={<EmployeeList></EmployeeList>}></Route>
        <Route path="/details" element={<EmployeeDetails></EmployeeDetails>}></Route>
        <Route path="/employee" element={<div>Employee Dashboard</div>} />
        <Route path="/exportcv" element={<CVExport></CVExport>}></Route>
      </Routes>
    </main>
  );
};

export default Main;
