import React from "react";
import "../../styles/layouts/main.css";
import User from "../User/index";
import EditUser from "../User/EditUser";
import EmployeeRoutes from '../../pages/Employee';
import { Route, Routes } from "react-router-dom";

const Main = () => {
  return (
    <>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/employees/*" element={<EmployeeRoutes />} />
        </Routes>
      </main>
    </>
  );
};

export default Main;
