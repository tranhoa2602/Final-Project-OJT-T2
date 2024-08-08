import React, { useState, useEffect } from "react";
import "../../styles/layouts/main.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import CreateEmployee from "../Employee/Employee_Information/CreateEmployee";
import TechList from "../Tech/TechList";
import AddTech from "../Tech/AddTech";
import EditTech from "../Tech/EditTech";
import ViewLanguage from "../Language/ViewLanguage";
import AddLanguage from "../Language/AddLanguage";
import EditLanguage from "../Language/EditLanguage";
import Login from "../../Components/Account/Login.jsx";
import Register from "../../Components/Account/Register.jsx";
import ForgetPassword from "../../Components/Account/ForgetPassword.jsx";
import ResetPassword from "../../Components/Account/ResetPassword.jsx";
import Admin from "../../Components/Account/Admin.jsx";
import AdminRoute from "../Admin/AdminRoute";
import EditEmployee from "../Employee/Employee_Information/EditEmployee";
import EmployeeList from "../Employee/Employee_Information/EmployeeList";
import EmployeeDetails from "../Employee/Employee_Information/EmployeeDetails";
import ChangePassword from "../../Components/Account/ChangePassword.jsx";
import ListPosition from "../PositionManager/ListPosition";
import EditProject from "../ProjectManager/EditProject";
import ProjectList from "../ProjectManager/ProjectList";
import CreateProject from "../ProjectManager/CreateProject";
import DetailProject from "../ProjectManager/DetailProject";
import TechBin from "../Tech/TechBin";
import TechHistory from "../Tech/TechHistory";
import ProjectHistory from "../ProjectManager/ProjectHistory";
import LanguageBin from "../Language/LanguageBin";
import ProjectBin from "../ProjectManager/ProjectBin.jsx";
import EmployeeBin from "../Employee/Employee_Information/EmployeeBin";
import { EmployeeProvider } from "../Employee/Employee_Information/EmployeeContext";
import VerifyAccount from "../../../VerifyAccount";
import EmployeeCV from "../Employee/Employee_Information/EmployeeCV.jsx";
import ProfileDetail from "../User/ProfileDetail";
import ProfileEdit from "../User/ProfileEdit";
import Dashboard from "../../Components/pages/Dashboard.jsx";

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      const userRolePath =
        storedUser.role === "Admin" ? "/dashboard" : "/profile";
      if (location.pathname === "/") {
        navigate(userRolePath);
      }
    } else {
      if (
        location.pathname === "/" ||
        ![
          "/register",
          "/forget-password",
          "/reset-password",
          "/change-password",
        ].includes(location.pathname)
      ) {
        navigate("/");
      }
    }
  }, [location.pathname, navigate]);

  return (
    <EmployeeProvider>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
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
          <Route path="/create" element={<CreateEmployee />} />
          <Route path="/edit" element={<EditEmployee />} />
          <Route path="/list" element={<EmployeeList />} />
          <Route path="/details" element={<EmployeeDetails />} />
          <Route path="/profile" element={<ProfileDetail />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/edit-profile" element={<ProfileEdit />} />
          <Route path="/cv/:id" element={<EmployeeCV />} />
          <Route path="/addTech" element={<AddTech />} />
          <Route path="/editTech/:id" element={<EditTech />} />
          <Route path="/techList" element={<TechList />} />
          <Route path="/addLanguage" element={<AddLanguage />} />
          <Route path="/editLanguage/:id" element={<EditLanguage />} />
          <Route path="/viewLanguage" element={<ViewLanguage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/listPosition" element={<ListPosition />} />
          <Route path="/Projects" element={<ProjectList />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />
          <Route path="/projects/details/:id" element={<DetailProject />} />
          <Route path="/techBin" element={<TechBin />} />
          <Route path="/techHistory" element={<TechHistory />} />
          <Route path="/projectHistory" element={<ProjectHistory />} />
          <Route path="/eanguageBin" element={<LanguageBin />} />
          <Route path="/employeeBin" element={<EmployeeBin />} />
          <Route path="/projectBin" element={<ProjectBin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Corrected path */}
        </Routes>
      </main>
    </EmployeeProvider>
  );
};

export default Main;
