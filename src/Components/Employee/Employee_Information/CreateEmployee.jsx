import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import emailjs from "emailjs-com";
import { useTranslation } from "react-i18next";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "../../../../emailConfig";

const CreateEmployee = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    const db = getDatabase();
    const employeesRef = ref(db, "employees");

    const snapshot = await get(employeesRef);
    const employees = snapshot.exists() ? snapshot.val() : {};

    const emailLowercase = values.email.toLowerCase();

    const emailExists = Object.values(employees).some(
      (employee) => employee.email === emailLowercase
    );

    if (emailExists) {
      message.error(t("This email already exists."));
      setLoading(false);
      return;
    }

    const newEmployeeId = uuidv4();
    const hashedPassword = await bcrypt.hash("1234567", 10);

    const newEmployee = {
      id: newEmployeeId,
      name: values.name,
      phone: values.phone,
      email: emailLowercase,
      password: hashedPassword,
      role: "Employee",
      status: "Involved",
      cv_list: [
        {
          cv_experience: [
            {
              description: values.description || "",
            },
          ],
        },
      ],
      deleteStatus: false,
    };

    const verificationToken = uuidv4();
    const verificationLink = `http://localhost:5173/verify-account?email=${encodeURIComponent(
      emailLowercase
    )}&token=${verificationToken}`;

    try {
      await set(ref(db, `employees/${newEmployeeId}`), {
        ...newEmployee,
        verificationToken,
        IsExist: "false",
      });

      sendVerificationEmail(emailLowercase, verificationLink);

      navigate("/list");
      message.success(t("Employee created successfully!"));
    } catch (error) {
      console.error(t("Error creating employee:"), error);
      message.error(t("Failed to create employee"));
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = (email, verificationLink) => {
    const templateParams = {
      to_name: email,
      from_name: "Your Company Name",
      message: `Click this link to verify your account: ${verificationLink}`,
    };

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  const gotoEmployeeList = () => {
    navigate("/list");
  };

  const validateEmail = (_, value) => {
    if (value && /^[A-Z]/.test(value)) {
      return Promise.reject(
        new Error(t("The first letter of the email cannot be capitalized"))
      );
    }
    return Promise.resolve();
  };

  return (
    <div style={{ height: "100vh", marginTop: "20px" }}>
      {loading ? (
        <Spin
          size="large"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        />
      ) : (
        <Form
          form={form}
          onFinish={handleSubmit}
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <Form.Item
            label={t("Name")}
            name="name"
            rules={[{ required: true, message: t("Please input the name!") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("Email")}
            name="email"
            rules={[
              { required: true, message: t("Please input the email!") },
              { type: "email", message: t("Please input a valid email!") },
              { validator: validateEmail },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("Phone")}
            name="phone"
            rules={[
              { required: true, message: t("Please input the phone number!") },
              {
                pattern: /^0[0-9]{9,15}$/,
                message: t("Phone number must have 10 numbers"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {t("Create Account")}
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" onClick={gotoEmployeeList}>
              {t("Back")}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default CreateEmployee;
