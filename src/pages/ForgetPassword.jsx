import React, { useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import styles from "../styles/layouts/ForgetPassword.module.scss";

const { Title } = Typography;

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (error) {
      setError("Failed to send password reset email. Please try again.");
      setMessage("");
    }
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
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              type="email"
              placeholder="Input your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
