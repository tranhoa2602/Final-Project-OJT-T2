import React from "react";
import { Button, Form, Input, Typography, message, Switch, Select } from "antd";
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
      values.programingstatus = values.programingstatus ? "Active" : "Inactive";

      await axios.post(
        `${firebaseConfig.databaseURL}/programmingLanguages.json`,
        values
      );

      message.success("Programming Language added successfully!");
      form.resetFields();
      navigate("/ViewLanguage");
    } catch (error) {
      console.error("Error adding Programming Language: ", error);
      message.error("Failed to add Programming Language.");
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
      <Title level={2}>Add New Programming Language</Title>
      <Form.Item
        label="ProgramLanguageName"
        name="programingname"
        rules={[{ required: true, message: "Please input Program Language Name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="ProgramLanguageType"
        name="programingtype"
        rules={[{ required: true, message: "Please input Program Language Type!" }]}
      >
        <Select mode="tags" style={{ width: "100%" }} placeholder="Tags Mode" />
      </Form.Item>
      <Form.Item
        label="ProgramLanguageStatus"
        name="programingstatus"
        valuePropName="checked"
        rules={[{ required: true, message: "Please select Program Language Status!" }]}
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
      <Form.Item label="ProgramLanguageDescription" name="programingdescription">
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddLanguage;
