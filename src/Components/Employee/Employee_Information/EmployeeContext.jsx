import React, { createContext, useContext, useState } from "react";

const EmployeeContext = createContext();

export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  const handleAdd = (employee) => {
    setEmployees([...employees, { ...employee, key: employees.length + 1 }]);
  };

  const handleEdit = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.key === updatedEmployee.key ? updatedEmployee : employee
        )
      );
  };

  const handleDelete = (key) => {
    setEmployees(employees.filter((employee) => employee.key !== key));
  };

  return (
    <EmployeeContext.Provider value={{ employees, handleAdd, handleEdit, handleDelete }}>
      {children}
    </EmployeeContext.Provider>
  );
};
