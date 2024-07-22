import React from "react";
import "../../styles/layouts/main.css";
// import User from "../User/index";
import EditUser from "../User/EditUser";
import { Route, Routes } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
// import Sidebar from "./Sidebar";
import Login from "../../pages/Login";
import AddTech from "../Tech/AddTech";
import EditTech from "../Tech/EditTech";
import TechList from "../Tech/TechList";

import AddLanguage from "../Language/AddLanguage";
import EditLanguage from "../Language/EditLanguage";
import ViewLanguage from "../Language/ViewLanguage";

const Main = () => {
  return (
    <>
      <main className="main-content">
        <Routes>
          {" "}
          {/* <Route path="/Sidebar" element={<Sidebar />} /> */}{" "}
          <Route path="/edit-user/:id" element={<EditUser />} />{" "}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/create" element={<Create />} />{" "}
          <Route path="/AddTech" element={<AddTech />} />{" "}
          <Route path="/EditTech" element={<EditTech />} />{" "}
          <Route path="/TechList" element={<TechList />} />{" "}
          <Route path="/ViewLanguage" element={<ViewLanguage />} />{" "}
          <Route path="/EditLanguage" element={<EditLanguage />} />{" "}
          <Route path="/AddLanguage" element={<AddLanguage />} />{" "}
        </Routes>{" "}
      </main>{" "}
    </>
  );
};

export default Main;
