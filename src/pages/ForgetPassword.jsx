import emailjs from "emailjs-com";
import React, { useState, useEffect } from "react";
import { get, getDatabase, ref } from "firebase/database";
import { Form, Input, Button, Typography, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "../styles/layouts/ForgetPassword.module.scss";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "../../emailConfig"; // Import email configuration

const { Title } = Typography;

const ForgetPassword = () => {
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const db = getDatabase();
        const employeeRef = ref(db, "employees");
        const snapshot = await get(employeeRef);
        const employeeData = snapshot.val();
        if (employeeData) {
          const employeesData = Object.values(employeeData);
          setEmployees(employeesData);
        }
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  const sendResetPasswordEmail = async (email, resetLink) => {
    try {
      const templateParams = {
        to_name: email,
        from_name: "Your Company Name",
        message: `Click this link to reset your password: ${resetLink}`,
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      );

      console.log("SUCCESS!", result.status, result.text);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (error) {
      console.error("FAILED...", error);
      setError("Failed to send password reset email. Please try again.");
      setMessage("");
    }
  };

  const handleSubmit = async () => {
    const employee = employees.find((emp) => emp.email === employeeEmail);

    if (!employee) {
      setError("Employee email not found. Please check and try again.");
      return;
    }

    const resetLink = `${
      window.location.origin
    }/reset-password?email=${encodeURIComponent(employee.email)}`;
    sendResetPasswordEmail(employee.email, resetLink);
  };

  return (
    <div className={styles["forget-password-container"]}>
      <div className={styles["forget-password-form"]}>
        <div className={styles["header-form"]}>
          <Title level={2} className={styles["title"]}>
            Forget Password
          </Title>
        </div>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input the employee's email!" },
            ]}
          >
            <Input
              type="email"
              placeholder="Enter employee's email"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
            />
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          {message && <Alert message={message} type="success" showIcon />}
          <Form.Item>
            <Button
              className={styles["btn-reset"]}
              type="primary"
              htmlType="submit"
              block
            >
              Send Reset Email
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="link"
          className={styles["link-button"]}
          onClick={() => navigate("/")}
          block
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default ForgetPassword;
