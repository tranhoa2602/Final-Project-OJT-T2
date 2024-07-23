import React, { useState } from "react";
import "../../styles/layouts/main.css";
// import EditUser from "../User/EditUser";
import { Route, Routes } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import Login from "../../pages/Login";
import Admin from "../../pages/Admin";

const Main = () => {
  const [user, setUser] = useState(null);

  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/edit-user/:id" element={<EditUser />} /> */}
        <Route path="/create" element={<Create />} />
      </Routes>
    </main>
  );
};

export default Main;
