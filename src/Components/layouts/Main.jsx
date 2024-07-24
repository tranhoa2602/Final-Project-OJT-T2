import React, { useState, useEffect } from "react";
import "../../styles/layouts/main.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import TechList from "../Tech/TechList";
import AddTech from "../Tech/AddTech";
import EditTech from "../Tech/EditTech";
import Login from "../../pages/Login";
import Admin from "../../pages/Admin";
import AdminRoute from "../Admin/AdminRoute";

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      navigate(storedUser.role === "Admin" ? "/admin" : "/employee");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
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
        <Route path="/EditTech" element={<EditTech />} />{" "}
        <Route path="/TechList" element={<TechList />} />{" "}
        <Route path="/employee" element={<div> Employee Dashboard </div>} />
      </Routes>{" "}
    </main>
  );
};

export default Main;
