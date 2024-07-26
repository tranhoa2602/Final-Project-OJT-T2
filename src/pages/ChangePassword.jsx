import React, { useState } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { getDatabase, ref, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import styles from "../styles/layouts/ChangePassword.module.scss";

const ChangePassword = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.id}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        userData.password
      );

      if (!isPasswordCorrect) {
        setError("Current password is incorrect.");
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await update(userRef, { password: hashedPassword });

      setSuccessMessage("Password changed successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error changing password: ", error);
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div className={styles["change-password-container"]}>
      <div className={styles["change-password-form"]}>
        <div className={styles["header-form"]}>
          <h2 className={styles["title"]}>Change Password</h2>
        </div>
        <Form onFinish={handleChangePassword}>
          <Form.Item
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password placeholder="Current Password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
          >
            <Input.Password placeholder="New Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your new password!" },
            ]}
          >
            <Input.Password placeholder="Confirm New Password" />
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          {successMessage && (
            <Alert message={successMessage} type="success" showIcon />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
