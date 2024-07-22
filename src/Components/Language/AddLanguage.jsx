import React from "react";
import { Button, Form, Input, Typography } from "antd";

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

const { Title } = Typography;

const AddLanguage = () => (
  <Form {...formItemLayout} style={{ height: "100vh" }}>
    <Title level={2}> Add New Technology </Title>{" "}
    <Form.Item
      label="TechName"
      name="techname"
      rules={[{ required: true, message: "Please input Tech Name!" }]}
    >
      <Input />
    </Form.Item>{" "}
    <Form.Item
      label="TechType"
      name="techtype"
      rules={[{ required: true, message: "Please input Tech Type!" }]}
    >
      <Input />
    </Form.Item>{" "}
    <Form.Item label="TechStatus" name="techstatus">
      <Input />
    </Form.Item>{" "}
    <Form.Item label="TechDescription" name="techdescription">
      <Input />
    </Form.Item>{" "}
    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit{" "}
      </Button>{" "}
    </Form.Item>{" "}
  </Form>
);

export default AddLanguage;
