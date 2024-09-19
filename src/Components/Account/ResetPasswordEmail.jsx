import React, { useState, useEffect } from "react";
import { get, getDatabase, ref, update, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid"; // Ensure uuid is imported
import emailjs from "emailjs-com";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "../../../emailConfig"; // Import email configuration
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const sendResetPasswordEmail = (email, resetLink) => {
  const templateParams = {
    to_email: email, // Use the email address of the recipient
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

const sendVerificationEmail = (email, verifyLink) => {
  const templateParams = {
    to_email: email, // Use the email address of the recipient
    to_name: email,
    from_name: "Your Company Name",
    message: `Click this link to verify your account: ${verifyLink}`,
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
          const employeesData = Object.values(userData).filter(
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
      const resetLink = `http://150.95.115.36:9999/reset-password?token=${generateToken()}`;
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

const handleAddOrUpdateUser = async (
  values,
  setUsers,
  setEditMode,
  setEditUserKey,
  form,
  editMode,
  editUserKey
) => {
  const { email, role, status = "inactive" } = values;

  if (!email || !role || !status) {
    message.error("Please fill in all fields");
    return;
  }

  try {
    const db = getDatabase();
    const userKey = editMode ? editUserKey : uuidv4();
    const verificationToken = uuidv4(); // Generate a unique token for verification
    const userRef = ref(db, `users/${userKey}`);
    let userData = {
      id: userKey,
      email,
      password: "1234567", // Default password
      contact: "",
      cv_list: [
        {
          title: "",
          description: "",
          file: "",
          updatedAt: new Date().toISOString(),
        },
      ],
      role,
      status,
      createdAt: new Date().toISOString(),
      projectIds: "",
      skill: "",
      verificationToken, // Add the verification token to user data
    };

    if (editMode) {
      await update(userRef, userData);
      message.success("User updated successfully!");
    } else {
      await set(userRef, userData);
      message.success("User added successfully!");

      // Send verification email
      const verifyLink = `http://150.95.115.36:9999/verify-account?email=${encodeURIComponent(
        email
      )}&token=${verificationToken}`;
      sendVerificationEmail(email, verifyLink);
    }

    form.resetFields();
    setEditMode(false);
    setEditUserKey("");

    const updatedSnapshot = await get(ref(db, "users"));
    const updatedUserData = updatedSnapshot.val();
    if (updatedUserData) {
      setUsers(
        Object.entries(updatedUserData).map(([key, user]) => ({
          ...user,
          key,
        }))
      );
    }
  } catch (error) {
    message.error("Error adding or updating user");
    console.error("Error adding or updating user: ", error);
  }
};

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

export {
  ResetPasswordEmail,
  handleAddOrUpdateUser,
  sendVerificationEmail,
  VerifyAccount,
};
