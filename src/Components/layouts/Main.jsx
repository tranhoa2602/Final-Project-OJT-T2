import React from "react";
import "../../styles/layouts/main.css";
// import User from "../User/index";
import EditUser from "../User/EditUser";
import { Route, Routes } from "react-router-dom";
import Create from "../Employee/Employee_Information/CreateEmployee";
import Sidebar from "./Sidebar";
import EmployeeList from "../Employee/Employee_Information/EmployeeList";
import EmployeeDetails from "../Employee/Employee_Information/EmployeeDetails";
import Edit from "../Employee/Employee_Information/EditEmployee";

const Main = () => {
  return (
    <>
      <main className="main-content">
        <Routes>
          <Route path="/Sidebar" element={<Sidebar />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/create-user" element={<Create></Create>}></Route>
          <Route path="/user-list" element={<EmployeeList></EmployeeList>}></Route>
          <Route path="/user-details" element={<EmployeeDetails></EmployeeDetails>}></Route>
          <Route path="/edit-user" element={<Edit></Edit>}></Route>
        </Routes>
      </main>
    </>
  );
};

export default Main;
