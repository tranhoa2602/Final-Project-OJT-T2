import React from "react";
import { Route, Routes, useResolvedPath } from "react-router-dom";
import EmployeeList from "../Components/Employee/Employee_Information/EmployeeList";
import EmployeeDetails from "../Components/Employee/Employee_Information/EmployeeDetails";
import CreateEmployee from "../Components/Employee/Employee_Information/CreateEmployee";
import EditEmployee from "../Components/Employee/Employee_Information/EditEmployee";
import ExportEmployeeList from "../Components/Employee/Employee_Information/ExportEmployeeList";
import ExportEmployeeCV from "../Components/Employee/Employee_Information/ExportEmployeeCV";
import AssignProject from "../Components/Employee/Project_Assignment/AssignProject";
import AssignedProjects from "../Components/Employee/Project_Assignment/AssignedProjects";
import RemoveEmployeeFromProject from "../Components/Employee/Project_Assignment/RemoveEmployeeFromProject";
import EmailNotification from "../Components/Employee/Project_Assignment/EmailNotification";

const EmployeeRoutes = () => {
  let resolvedPath = useResolvedPath("");

  return (
    <Routes>
      <Route path={`${resolvedPath.pathnameBase}/`} element={<EmployeeList />} />
      <Route path={`${resolvedPath.pathnameBase}/details/:id`} element={<EmployeeDetails />} />
      <Route path={`${resolvedPath.pathnameBase}/create`} element={<CreateEmployee />} />
      <Route path={`${resolvedPath.pathnameBase}/edit/:id`} element={<EditEmployee />} />
      <Route path={`${resolvedPath.pathnameBase}/export-list`} element={<ExportEmployeeList />} />
      <Route path={`${resolvedPath.pathnameBase}/export-cv/:id`} element={<ExportEmployeeCV />} />
      <Route path={`${resolvedPath.pathnameBase}/assign/:id`} element={<AssignProject />} />
      <Route path={`${resolvedPath.pathnameBase}/assigned/:id`} element={<AssignedProjects />} />
      <Route path={`${resolvedPath.pathnameBase}/remove/:id`} element={<RemoveEmployeeFromProject />} />
      <Route path={`${resolvedPath.pathnameBase}/email-notification`} element={<EmailNotification />} />
    </Routes>
  );
};

export default EmployeeRoutes;
