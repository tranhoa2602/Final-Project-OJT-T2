import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AssignProject from '../Components/Employee/Project_Assignment/AssignProject';
import AssignedProjects from '../Components/Employee/Project_Assignment/AssignedProjects';
import RemoveEmployeeFromProject from '../Components/Employee/Project_Assignment/RemoveEmployeeFromProject';
import EmailNotification from '../Components/Employee/Project_Assignment/EmailNotification';

const EmployeeRoutes = () => {
    return (
        <Routes>
            <Route path="assign/:id" element={<AssignProject />} />
            <Route path="assigned/:id" element={<AssignedProjects />} />
            <Route path="remove/:id" element={<RemoveEmployeeFromProject />} />
            <Route path="email-notification" element={<EmailNotification />} />
        </Routes>
    );
};

export default EmployeeRoutes;
