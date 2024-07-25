import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from "antd";
import { loginUser } from "../service/authService.js";
import styles from "../styles/layouts/Login.module.scss";

const { Title } = Typography;

function Login({ setUser }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUser(user);
        navigate(user.email === "admin1@gmail.com" ? "/admin" : "/employee");
      }
    } catch (e) {
      console.error("Invalid user data in localStorage:", e);
      localStorage.removeItem("user"); // Remove invalid data
    }
  }, [setUser, navigate]);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    const { user, error } = await loginUser(email, password);
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.email === "admin1@gmail.com" ? "/admin" : "/employee");
    } else {
      setError(error);
    }
  };

  const forgetPassword = () => {
    navigate("/forget-password");
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-form"]}>
        <div className={styles["header-form"]}>
          <Title level={2} className={styles["title"]}>
            Login
          </Title>
        </div>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" placeholder="Input your email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Input your password" />
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          <Form.Item>
            <Button
              className={styles["btn-login"]}
              type="primary"
              htmlType="submit"
              block
            >
              Login
            </Button>
            <Button
              type="link"
              onClick={forgetPassword}
              className={styles["link-forget"]}
            >
              Forgot Password?
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="link"
          className={styles["link-button"]}
          onClick={() => navigate("/register")}
          block
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
