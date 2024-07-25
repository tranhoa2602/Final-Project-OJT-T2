import React, { useState, useEffect } from "react";
import "../../styles/layouts/main.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import TechList from "../Tech/TechList";
import AddTech from "../Tech/AddTech";
import EditTech from "../Tech/EditTech";
import ViewLanguage from "../Language/ViewLanguage";
import AddLanguage from "../Language/AddLanguage";
import EditLanguage from "../Language/EditLanguage";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgetPassword from "../../pages/ForgetPassword"; // Import trang ForgetPassword
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
        <Route path="/forget-password" element={<ForgetPassword />} />{" "}
        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <Admin />
            </AdminRoute>
          }
        />{" "}
        <Route path="/create" element={<Create />} />{" "}
        <Route path="/AddTech" element={<AddTech />} />{" "}
        <Route path="/EditTech/:id" element={<EditTech />} />{" "}
        <Route path="/TechList" element={<TechList />} />{" "}
        <Route path="/AddLanguage" element={<AddLanguage />} />{" "}
        <Route path="/EditLanguage/:id" element={<EditLanguage />} />{" "}
        <Route path="/ViewLanguage" element={<ViewLanguage />} />{" "}
        <Route path="/employee" element={<div> Employee Dashboard </div>} />
      </Routes>{" "}
    </main>
  );
};

export default Main;
