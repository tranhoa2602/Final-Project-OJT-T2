import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { message } from "antd";

const VerifyAccount = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      const query = new URLSearchParams(window.location.search);
      const email = query.get("email");
      const token = query.get("token");

      try {
        const db = getDatabase();
        const employeesRef = ref(db, "employees");

        const snapshot = await get(employeesRef);
        if (!snapshot.exists()) {
          message.error("Invalid verification link.");
          return;
        }

        const employees = snapshot.val();
        const employee = Object.values(employees).find(
          (emp) => emp.email === email && emp.verificationToken === token
        );

        if (!employee) {
          message.error("Invalid verification link.");
          return;
        }

        const employeeRef = ref(db, `employees/${employee.id}`);
        await update(employeeRef, {
          status: "active",
          verificationToken: null,
        });

        message.success("Account verified successfully!");
        navigate("/list");
      } catch (error) {
        console.error("Error verifying account:", error);
        message.error("Internal server error.");
      }
    };

    verifyAccount();
  }, [navigate]);

  return null;
};

export default VerifyAccount;
