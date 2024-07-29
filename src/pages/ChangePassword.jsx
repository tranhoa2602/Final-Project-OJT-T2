import React, { useState } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { getDatabase, ref, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { useTranslation } from "react-i18next";
import styles from "../styles/layouts/ChangePassword.module.scss";

const ChangePassword = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      setError(t("New passwords do not match."));
      return;
    }

    try {
      const db = getDatabase();
      const usersRef = ref(db, `users`);
      const snapshot = await get(usersRef);
      const usersData = snapshot.val();

      const adminUsers = Object.entries(usersData)
        .filter(([key, userData]) => userData.role === "Admin")
        .map(([key, userData]) => ({ ...userData, key }));

      let currentPasswordMatch = false;

      for (let admin of adminUsers) {
        const isPasswordCorrect = await bcrypt.compare(
          currentPassword,
          admin.password
        );

        if (isPasswordCorrect) {
          currentPasswordMatch = true;
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          const userRef = ref(db, `users/${admin.key}`);
          await update(userRef, { password: hashedPassword });
        }
      }

      if (!currentPasswordMatch) {
        setError(t("Current password is incorrect."));
        return;
      }

      setSuccessMessage(t("Password changed successfully!"));
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error changing password: ", error);
      setError(t("Failed to change password. Please try again."));
    }
  };

  return (
    <div className={styles["change-password-container"]}>
      <div className={styles["change-password-form"]}>
        <div className={styles["header-form"]}>
          <h2 className={styles["title"]}>{t("Change Password")}</h2>
        </div>
        <Form onFinish={handleChangePassword}>
          <Form.Item
            name="currentPassword"
            rules={[
              {
                required: true,
                message: t("Please input your current password!"),
              },
            ]}
          >
            <Input.Password placeholder={t("Current Password")} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: t("Please input your new password!") },
            ]}
          >
            <Input.Password placeholder={t("New Password")} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: t("Please confirm your new password!"),
              },
            ]}
          >
            <Input.Password placeholder={t("Confirm New Password")} />
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          {successMessage && (
            <Alert message={successMessage} type="success" showIcon />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("Change Password")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
