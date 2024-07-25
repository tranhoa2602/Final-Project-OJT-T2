import emailjs from "emailjs-com";
import React, { useState, useEffect } from "react";
import { get, getDatabase, ref } from "firebase/database";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "../../emailConfig"; // Import cấu hình email

const sendResetPasswordEmail = (email, resetLink) => {
  const templateParams = {
    to_name: email,
    from_name: "Your Company Name",
    message: `Click this link to reset your password: ${resetLink}`,
  };

  emailjs
    .send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_USER_ID
    )
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
      },
      (error) => {
        console.log("FAILED...", error);
      }
    );
};

const ResetPasswordEmail = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, "users");
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        if (userData) {
          const employeesData = userData.filter(
            (user) => user.role === "Employee" && user.email !== ""
          );
          setEmployees(employeesData);
        }
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSendEmail = () => {
    employees.forEach((employee) => {
      const resetLink = `https://your-app.com/reset-password?token=${generateToken()}`;
      sendResetPasswordEmail(employee.email, resetLink);
    });
  };

  const generateToken = () => {
    return Math.random().toString(36).substr(2);
  };

  return (
    <div>
      <button onClick={handleSendEmail}>
        Send Reset Password Email to Employees
      </button>
    </div>
  );
};

export default ResetPasswordEmail;
