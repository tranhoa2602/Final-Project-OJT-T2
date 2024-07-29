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

const AddTech = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      values.techstatus = values.techstatus ? "Active" : "Inactive";

      await axios.post(
        `${firebaseConfig.databaseURL}/technologies.json`,
        values
      );

      message.success("Technology added successfully!");
      form.resetFields();
      navigate("/TechList");
    } catch (error) {
      console.error("Error adding technology: ", error);
      message.error("Failed to add technology.");
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
      initialValues={{ techstatus: true }}
    >
      <Title level={2}>Add New Technology</Title>
      <Form.Item
        label="Tech Name"
        name="techname"
        rules={[{ required: true, message: "Please input Tech Name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tech Type"
        name="techtype"
        rules={[{ required: true, message: "Please input Tech Type!" }]}
      >
        <Select mode="tags" style={{ width: "100%" }} placeholder="Tags Mode" />
      </Form.Item>
      <Form.Item
        label="Tech Status"
        name="techstatus"
        valuePropName="checked"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
      <Form.Item label="Tech Description" name="techdescription">
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

export default AddTech;
