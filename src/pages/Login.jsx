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
      const userRef = ref(db, "users");
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      const user = Object.values(userData).find((user) => user.email === email);

      if (user && (await bcrypt.compare(password, user.password))) {
        const storedUser = {
          key: user.id, // Ensure the user ID is stored correctly
          role: user.role,
        };
        localStorage.setItem("user", JSON.stringify(storedUser));
        setUser(storedUser);

        const userRolePath = user.role === "Admin" ? "/admin" : "/profile";
        navigate(userRolePath);
        message.success("Login successful!");
      } else {
        message.error("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login: ", error);
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
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
