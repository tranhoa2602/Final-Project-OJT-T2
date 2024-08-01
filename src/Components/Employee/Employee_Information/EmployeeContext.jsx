import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  push,
  get,
  set,
  update,
  remove,
} from "firebase/database";
import { database } from "../../../../firebaseConfig"; // Điều chỉnh đường dẫn nếu cần thiết
import { message } from "antd";
import { useTranslation } from "react-i18next";

const EmployeeContext = createContext();

export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const employeesRef = ref(database, "employees");
    const snapshot = await get(employeesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const formattedData = Object.keys(data).map((key) => ({
        key, // Sử dụng khóa từ database làm khóa duy nhất
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
    const newEmployeeRef = push(employeesRef); // Tạo một ID duy nhất mới

    // Thêm dữ liệu nhân viên dưới ID duy nhất mới
    const newEmployee = {
      ...employee,
      key: newEmployeeRef.key, // Sử dụng khóa được tạo
    };

    await set(newEmployeeRef, newEmployee);

    // Cập nhật trạng thái local
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

    try {
      // Lấy dữ liệu nhân viên để kiểm tra trạng thái
      const snapshot = await get(employeeRef);
      if (snapshot.exists()) {
        const employee = snapshot.val();
        const status = employee.status;

        if (status === "active") {
          message.error(t("Cannot delete an active employee."));
          return;
        }

        // Tiến hành xóa nếu trạng thái không phải là đang hoạt động
        await remove(employeeRef);
        message.success(t("Employee deleted!"));

        // Cập nhật trạng thái local
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.key !== key)
        );
      } else {
        message.error(t("Employee not found."));
      }
    } catch (error) {
      message.error(t("Error deleting employee: ") + error.message);
    }
  };

  const handleStatusChange = (key, status) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.key === key ? { ...employee, status } : employee
      )
    );
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, handleAdd, handleEdit, handleDelete }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
