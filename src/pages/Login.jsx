import { database } from "../../firebaseConfig.js";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from "antd";
import { loginUser, signUpUser } from "../service/authService.js";
import styles from "../styles/layouts/Login.module.scss"; // Ensure the SCSS module follows naming convention

const { Title } = Typography;

function Login({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    if (isSignUp) {
      const { success, error } = await signUpUser(
        email,
        password,
        setSuccessMessage,
        setError
      );
      if (!success) {
        setError(error);
      }
    } else {
      const { user, error } = await loginUser(
        email,
        password,
        setUser,
        setError,
        navigate
      );
      if (!user) {
        setError(error);
      }
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
            {isSignUp ? "Sign Up" : "Login"}
          </Title>
          {/* <img
            src="/public/images/logo.jpg"
            alt="logo"
            className={styles["logo-header"]}
          /> */}
        </div>
        <Form onFinish={handleSubmit}>
          <Form.Item
            // label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" placeholder="Input your email" />
          </Form.Item>
          <Form.Item
            // label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Input your password" />
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          {successMessage && (
            <div>
              <Alert message={successMessage} type="success" showIcon />
            </div>
          )}
          <Form.Item>
            <Button
              className={styles["btn-login"]}
              type="primary"
              htmlType="submit"
              block
            >
              {isSignUp ? "Sign Up" : "Login"}
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
          onClick={() => setIsSignUp(!isSignUp)}
          block
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Need an account? Sign Up"}
        </Button>
      </div>
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
