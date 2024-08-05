import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import emailjs from "emailjs-com";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "../../../../emailConfig";

const CreateEmployee = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleSubmit = async (values) => {
    setLoading(true); // Start loading

    const db = getDatabase();
    const employeesRef = ref(db, "employees");

    const snapshot = await get(employeesRef);
    const employees = snapshot.exists() ? snapshot.val() : {};

    // Convert email to lowercase
    const emailLowercase = values.email.toLowerCase();

    const emailExists = Object.values(employees).some(
      (employee) => employee.email === emailLowercase
    );

    if (emailExists) {
      message.error("This email already exists.");
      setLoading(false); // Stop loading
      return;
    }

    const newEmployeeId = uuidv4();
    const hashedPassword = await bcrypt.hash("1234567", 10);

    const newEmployee = {
      id: newEmployeeId,
      name: values.name,
      phone: values.phone,
      email: emailLowercase, // Store email in lowercase
      password: hashedPassword,
      role: "Employee", // Set default role to Employee
      status: "Involved", // Default status is Involved
      cv_list: [
        {
          cv_experience: [
            {
              description: values.description || "", // Ensure description is not undefined
            },
          ],
        },
      ],
      deleteStatus: false, // Added deleteStatus field with default value false
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
      message.success("Employee created successfully!");
    } catch (error) {
      console.error("Error creating employee:", error);
      message.error("Failed to create employee");
    } finally {
      setLoading(false); // Stop loading
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

  const handleConfirmSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        Modal.confirm({
          title: "Confirm Create",
          content: "Are you sure you want to create this employee?",
          onOk: () => handleSubmit(values),
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const gotoEmployeeList = () => {
    navigate("/list");
  };

  const validateEmail = (_, value) => {
    if (value && /^[A-Z]/.test(value)) {
      return Promise.reject(
        new Error("The first letter of the email cannot be capitalized")
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
          onFinish={handleConfirmSubmit}
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please input a valid email!" },
              { validator: validateEmail },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
              {
                pattern: /^0[0-9]{9,15}$/,
                message: "Phone number must have 10 numbers",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Create Account
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" onClick={gotoEmployeeList}>
              Back
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default CreateEmployee;
