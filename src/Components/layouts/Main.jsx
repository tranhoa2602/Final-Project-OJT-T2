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
import ForgetPassword from "../../pages/ForgetPassword";
import ResetPassword from "../../pages/ResetPassword";
import Admin from "../../pages/Admin";
import AdminRoute from "../Admin/AdminRoute";
<<<<<<< HEAD
import EditEmployee from "../Employee/Employee_Information/EditEmployee";
import EmployeeList from "../Employee/Employee_Information/EmployeeList";
import EmployeeDetails from "../Employee/Employee_Information/EmployeeDetails";
import CVExport from "../Employee/Employee_Information/ExportEmployeeCV";
import ChangePassword from "../../pages/ChangePassword";
import ListPosition from "../PositionManager/ListPosition";

=======
import EditEmployee from "../Employee/Employee_Information/EditEmployee"; // Import trang EditEmployee
import EmployeeList from "../Employee/Employee_Information/EmployeeList"; // Import trang EmployeeList
import EmployeeDetails from "../Employee/Employee_Information/EmployeeDetails"; // Import trang EmployeeDetails
import CVExport from "../Employee/Employee_Information/ExportEmployeeCV"; // Import trang CVExport
import { getDatabase, ref, get } from "firebase/database"; // Import the necessary Firebase functions
>>>>>>> d9274ebbf4936258c21b9fdfc1034b4afafc1644

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const fetchUserDetails = async () => {
        const db = getDatabase();
        const userRef = ref(db, `users/${storedUser.key}`);
        const snapshot = await get(userRef);
        const userDetails = snapshot.val();
        setUser({ ...storedUser, role: userDetails.role });
        const userRolePath =
          userDetails.role === "Admin" ? "/admin" : "/employee";
        if (
          location.pathname === "/" ||
          ["/register", "/forget-password", "/reset-password"].includes(
            location.pathname
          )
        ) {
          navigate(userRolePath);
        }
      };
      fetchUserDetails();
    } else {
<<<<<<< HEAD
      if (
        ![
          "/register",
          "/forget-password",
          "/reset-password",
          "/change-password",
        ].includes(location.pathname)
      ) {
        navigate("/");
      }
=======
      navigate("/");
>>>>>>> d9274ebbf4936258c21b9fdfc1034b4afafc1644
    }
  }, [navigate, location.pathname]);

  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route path="/employee" element={<div>Employee Dashboard</div>} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit" element={<EditEmployee />} />
        <Route path="/list" element={<EmployeeList />} />
        <Route path="/details" element={<EmployeeDetails />} />
        <Route path="/exportcv" element={<CVExport />} />
        <Route path="/AddTech" element={<AddTech />} />
        <Route path="/EditTech/:id" element={<EditTech />} />
        <Route path="/TechList" element={<TechList />} />
        <Route path="/AddLanguage" element={<AddLanguage />} />
        <Route path="/EditLanguage/:id" element={<EditLanguage />} />
        <Route path="/ViewLanguage" element={<ViewLanguage />} />
<<<<<<< HEAD
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/ListPosition" element={<ListPosition />} />

=======
>>>>>>> d9274ebbf4936258c21b9fdfc1034b4afafc1644
      </Routes>
    </main>
  );
};

export default Main;
