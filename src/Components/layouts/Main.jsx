import React, { useState } from "react";
import "../../styles/layouts/main.css";
import { Route, Routes } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import Login from "../../pages/Login";
import Admin from "../../pages/Admin";
import AdminRoute from "../Admin/AdminRoute";
import Project from '../Project/Project';
const Main = () => {
  const [user, setUser] = useState(null);

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
        />
        <Route path="/create" element={<Create />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </main>
  );
};

export default Main;
