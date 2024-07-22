import React from "react";
import "../../styles/layouts/main.css";
// import User from "../User/index";
import EditUser from "../User/EditUser";
import { Route, Routes } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import AddTech from "../Tech/AddTech";
import Sidebar from "./Sidebar";

const Main = () => {
  return (
    <>
      <main className="main-content">
        <Routes>
          <Route path="/Sidebar" element={<Sidebar />} />{" "}
          <Route path="/edit-user/:id" element={<EditUser />} />{" "}
        </Routes>{" "}
        <Create> </Create> <AddTech> </AddTech>{" "}
      </main>{" "}
    </>
  );
};

export default Main;
