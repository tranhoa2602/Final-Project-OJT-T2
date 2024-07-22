import React from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Mentions,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";

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

const Create = () => {
  const navigate = useNavigate();

  const gotoEmployeeList = () => {
    navigate('/user-list'); 
  };

  return (

  <Form {...formItemLayout} style={{ height: "100vh" }}>
    <Form.Item
      label="User Name"
      name="username"
      rules={[{ required: true, message: "Please input!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Mentions"
      name="Mentions"
      rules={[{ required: true, message: "Please input!" }]}
    >
      <Mentions />
    </Form.Item>

    <Form.Item
      label="Role"
      name="Select"
      rules={[{ required: true, message: "Please input!" }]}
    >
      <Select>
        <Select.Option value="admin">Admin</Select.Option>
        <Select.Option value="employee">Employee</Select.Option>

      </Select>
    </Form.Item>

    <Form.Item
      label="Cascader"
      name="Cascader"
      rules={[{ required: true, message: "Please input!" }]}
    >
      <Cascader />
    </Form.Item>

    <Form.Item
      label="TreeSelect"
      name="TreeSelect"
      rules={[{ required: true, message: "Please input!" }]}
    >
      <TreeSelect />
    </Form.Item>

    <Form.Item
      label="DatePicker"
      name="DatePicker"
      rules={[{ required: true, message: "Please input!" }]}
    >
      <DatePicker />
    </Form.Item>

    <Form.Item
      label="TextArea"
      name="TextArea"
      rules={[{ required: true, message: "Please input!" }]}
    >
      <Input.TextArea />
    </Form.Item>


    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
      <Button type="primary" htmlType="submit" onClick={gotoEmployeeList} >
        Empl. List
      </Button>
    </Form.Item>
  </Form>
  )
};

export default Create;
