import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert } from "antd";
import { getDatabase, ref, update } from "firebase/database";
import styles from "../styles/layouts/ResetPassword.module.scss";

const { Title } = Typography;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${email.replace(".", ",")}`);
      await update(userRef, { password: newPassword });
      setMessage(
        "Password reset successfully! You can now log in with your new password."
      );
      setError("");
    } catch (error) {
      console.error("Error updating password: ", error);
      setError("Failed to reset password. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className={styles["reset-password-container"]}>
      <div className={styles["reset-password-form"]}>
        <div className={styles["header-form"]}>
          <Title level={2} className={styles["title"]}>
            Reset Password
          </Title>
        </div>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
          >
            <Input.Password
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your new password!" },
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Reset Password
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

export default ResetPassword;
