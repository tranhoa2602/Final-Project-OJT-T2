import React from "react";
import { Button, Form, Input } from "antd";

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

const EditTech = () => (
  <Form {...formItemLayout} style={{ height: "100vh" }}>
    <Form.Item
      label="TechName"
      name="techname"
      rules={[{ required: true, message: "Please input change Tech Name!" }]}
    >
      <Input />
    </Form.Item>{" "}
    <Form.Item
      label="TechType"
      name="techtype"
      rules={[{ required: true, message: "Please input change Tech Type!" }]}
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

export default EditTech;
