import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import bcrypt from "bcryptjs";
import styles from "../styles/layouts/Login.module.scss";

const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      const db = getDatabase();

      // First, try to find the user in the "users" reference
      const userRef = ref(db, "users");
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
      const user = userData
        ? Object.values(userData).find((user) => user.email === email)
        : null;

      if (user) {
        await processLogin(user, password);
      } else {
        // If not found in "users", try to find the user in the "employees" reference
        const employeeRef = ref(db, "employees");
        const employeeSnapshot = await get(employeeRef);
        const employeeData = employeeSnapshot.val();
        const employee = employeeData
          ? Object.values(employeeData).find(
              (employee) => employee.email === email
            )
          : null;

        if (employee) {
          await processLogin(employee, password, true);
        } else {
          message.error("Invalid email or password.");
        }
      }
    } catch (error) {
      console.error("Error during login: ", error);
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processLogin = async (user, password, isEmployee = false) => {
    if (user.status === "inactive") {
      message.error("Your account is inactive. Please contact the admin.");
    } else if (await bcrypt.compare(password, user.password)) {
      const storedUser = {
        key: user.id, // Ensure the user ID is stored correctly
        role: isEmployee ? "Employee" : user.role,
        position: isEmployee ? user.positionName : null,
      };
      localStorage.setItem("user", JSON.stringify(storedUser));
      setUser(storedUser);

      const userRolePath =
        storedUser.role === "Admin" ? "/Dashboard" : "/profile";
      navigate(userRolePath);
      message.success("Login successful!");
    } else {
      message.error("Invalid email or password.");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-form"]}>
        <div className={styles["header-form"]}>
          <h2 className={styles["title"]}>Login</h2>
        </div>
        <Form onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles["btn-login"]}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <a href="/forget-password" className={styles["link-forget"]}>
          Forgot password?
        </a>
      </div>
    </div>
  );
};

export default Login;
