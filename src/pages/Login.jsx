import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { useTranslation } from "react-i18next";
import styles from "../styles/layouts/Login.module.scss";

const Login = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;

    try {
      const db = getDatabase();
      const userRef = ref(db, `users`);
      const snapshot = await get(userRef);
      const users = snapshot.val();

      if (!users) {
        setError(t("User not found"));
        return;
      }

      const user = Object.values(users).find((user) => user.email === email);

      if (!user) {
        setError(t("User not found"));
        return;
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        setError(t("Incorrect password"));
        return;
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      setError(t("Failed to log in. Please try again."));
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-form"]}>
        <div className={styles["header-form"]}>
          <h2 className={styles["title"]}>{t("Login")}</h2>
        </div>
        <Form onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: t("Please input your email!") }]}
          >
            <Input placeholder={t("Email")} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: t("Please input your password!") },
            ]}
          >
            <Input.Password placeholder={t("Password")} />
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("Login")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
