import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Alert, Select } from "antd";
import { signUpUser } from "../../service/authService";
import styles from "../../styles/layouts/Register.module.scss";

const { Title } = Typography;
const { Option } = Select;

function Register({ setUser }) {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { name, phone, email, password, confirmPassword, role } = values;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { success, error } = await signUpUser(
      name,
      phone,
      email,
      password,
      role,
      setSuccessMessage,
      setError
    );
    if (!success) {
      setError(error);
    } else {
      setSuccessMessage("Account created successfully! Redirecting to login.");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  return (
    <div className={styles["register-container"]}>
      <div className={styles["register-form"]}>
        <div className={styles["header-form"]}>
          <Title level={2} className={styles["title"]}>
            Sign Up
          </Title>
        </div>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input type="text" placeholder="Input your name" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input type="text" placeholder="Input your phone number" />
          </Form.Item>
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
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value="Employee">Employee</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          {successMessage && (
            <Alert message={successMessage} type="success" showIcon />
          )}
          <Form.Item>
            <Button
              className={styles["btn-register"]}
              type="primary"
              htmlType="submit"
              block
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="link"
          className={styles["link-button"]}
          onClick={() => navigate("/")}
          block
        >
          Already have an account? Login
        </Button>
      </div>
    </div>
  );
}

Register.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Register;
