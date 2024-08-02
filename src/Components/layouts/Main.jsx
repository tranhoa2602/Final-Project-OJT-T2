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
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgetPassword from "../../pages/ForgetPassword";
import ResetPassword from "../../pages/ResetPassword";
import Admin from "../../pages/Admin";
import AdminRoute from "../Admin/AdminRoute";
import EditEmployee from "../Employee/Employee_Information/EditEmployee";
import EmployeeList from "../Employee/Employee_Information/EmployeeList";
import EmployeeDetails from "../Employee/Employee_Information/EmployeeDetails";
import CVExport from "../Employee/Employee_Information/ExportEmployeeCV";
import ChangePassword from "../../pages/ChangePassword";
import ListPosition from "../PositionManager/ListPosition";
import EditProject from "../ProjectManager/EditProject";
import ProjectList from "../ProjectManager/ProjectList";
import CreateProject from "../ProjectManager/CreateProject";
import DetailProject from "../ProjectManager/DetailProject";
import TechBin from "../Tech/TechBin";
import LanguageBin from "../Language/LanguageBin";
import ProjectBin from "../ProjectManager/ProjectBin.jsx";
import EmployeeBin from "../Employee/Employee_Information/EmployeeBin";
import { EmployeeProvider } from "../Employee/Employee_Information/EmployeeContext";
// import AssignEmployee from "../ProjectManager/AssignEmployee/Assign"; // Import AssignEmployee
import VerifyAccount from "../../../VerifyAccount";
// import UnassignEmployee from "../ProjectManager/AssignEmployee/Unassign";
import ProfileDetail from "../User/ProfileDetail";
import ProfileEdit from "../User/ProfileEdit";

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      const userRolePath = storedUser.role === "Admin" ? "/admin" : "/profile";
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
          <Route path="/verify-account" element={<VerifyAccount />} />{" "}
          {/* Add the VerifyAccount route */}
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
          <Route path="/exportcv" element={<CVExport />} />
          <Route path="/AddTech" element={<AddTech />} />
          <Route path="/EditTech/:id" element={<EditTech />} />
          <Route path="/TechList" element={<TechList />} />
          <Route path="/AddLanguage" element={<AddLanguage />} />
          <Route path="/EditLanguage/:id" element={<EditLanguage />} />
          <Route path="/ViewLanguage" element={<ViewLanguage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/ListPosition" element={<ListPosition />} />
          <Route path="/Projects" element={<ProjectList />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/projects/edit/:id" element={<EditProject />} />
          <Route path="/projects/details/:id" element={<DetailProject />} />
          <Route path="/TechBin" element={<TechBin />} />
          <Route path="/LanguageBin" element={<LanguageBin />} />
          <Route path="/EmployeeBin" element={<EmployeeBin />} />
          <Route path="/ProjectBin" element={<ProjectBin />} />
        </Routes>
      </main>
    </EmployeeProvider>
  );
};

export default Main;
