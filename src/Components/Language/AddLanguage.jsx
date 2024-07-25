import React from "react";
import { Button, Form, Input, Typography, message } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const AddLanguage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await axios.post(
        `${firebaseConfig.databaseURL}/programmingLanguages.json`,
        values
      );

      message.success("Programming Languages added successfully!");

      form.resetFields();
      navigate("/ViewLanguage");
    } catch (error) {
      console.error("Error adding programming languages: ", error);
      message.error("Failed to add programming languages.");
    }
  };

  const handleFailure = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={handleSubmit}
      onFinishFailed={handleFailure}
      style={{ height: "100vh" }}
    >
      <Title level={2}> Add New Programing Language </Title>{" "}
      <Form.Item
        label="Programming Language Name"
        name="programingname"
        rules={[
          {
            required: true,
            message: "Please input Programming Language Name!",
          },
        ]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        label="Programming Language Type"
        name="programingtype"
        rules={[
          {
            required: true,
            message: "Please input Programming Language Name!",
          },
        ]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        label="Programming Language Status"
        name="programingstatus"
        rules={[
          {
            required: true,
            message: "Please select Programming Language Name!",
          },
        ]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        label="Programming Language Description"
        name="programingdescription"
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit{" "}
        </Button>{" "}
      </Form.Item>{" "}
    </Form>
  );
};

export default AddLanguage;
