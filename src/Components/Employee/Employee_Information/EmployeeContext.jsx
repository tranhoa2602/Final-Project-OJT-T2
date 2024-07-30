import React, { createContext, useContext, useEffect, useState } from "react";
import { getDatabase, ref, push, get, set, update, remove } from "firebase/database";
import { database } from "../../../../firebaseConfig"; // Adjust the path if necessary

const EmployeeContext = createContext();

export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const employeesRef = ref(database, "employees");
    const snapshot = await get(employeesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const formattedData = Object.keys(data).map((key) => ({
        key, // Use the database key as the unique key
        ...data[key],
      }));
      setEmployees(formattedData);
    } else {
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = async (employee) => {

    const employeesRef = ref(database, "employees");
    const newEmployeeRef = push(employeesRef); // Generate a new unique ID

    // Add the employee data under the new unique ID
    const newEmployee = {
      ...employee,
      key: newEmployeeRef.key, // Use the generated key
    };

    await set(newEmployeeRef, newEmployee);

    // Update local state
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };

  const handleEdit = async (updatedEmployee) => {

    const employeeRef = ref(database, `employees/${updatedEmployee.key}`);
    await update(employeeRef, updatedEmployee);
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.key === updatedEmployee.key ? updatedEmployee : employee
      )
    );
  };

  const handleDelete = async (key) => {
    const employeeRef = ref(database, `employees/${key}`);
    await remove(employeeRef);
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.key !== key)
    );
  };

  const handleStatusChange = (key, status) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.key === key ? { ...employee, status } : employee
      )
    );
  };

  return (
    <EmployeeContext.Provider value={{ employees, handleAdd, handleEdit, handleDelete }}>
      {children}
    </EmployeeContext.Provider>
  );
};
