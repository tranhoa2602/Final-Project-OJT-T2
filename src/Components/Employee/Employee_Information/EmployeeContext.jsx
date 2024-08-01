import React, { createContext, useContext, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";

const EmployeeContext = createContext();

export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployee = async (key) => {
    const db = getDatabase();
    const employeeRef = ref(db, `users/${key}`);
    const snapshot = await get(employeeRef);
    if (snapshot.exists()) {
      setSelectedEmployee(snapshot.val());
    } else {
      setSelectedEmployee(null);
    }
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, selectedEmployee, fetchEmployee }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
