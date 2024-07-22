import React from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TreeSelect,
} from 'antd';

const { RangePicker } = DatePicker;

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

const Create = () => (
  <Form
    {...formItemLayout}
    style={{height: '100vh'}}
  >
    <Form.Item
      label="User Name"
      name="username"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Unkniown"
      name="InputNumber"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item
      label="TextArea"
      name="TextArea"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <Input.TextArea />
    </Form.Item>

    <Form.Item
      label="Mentions"
      name="Mentions"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <Mentions />
    </Form.Item>

    <Form.Item
      label="Role"
      name="Select"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <Select onChange={onChange}>
        <Select.Option value="admin">Admin</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="Cascader"
      name="Cascader"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <Cascader />
    </Form.Item>

    <Form.Item
      label="TreeSelect"
      name="TreeSelect"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <TreeSelect />
    </Form.Item>

    <Form.Item
      label="DatePicker"
      name="DatePicker"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <DatePicker />
    </Form.Item>

    <Form.Item
      label="RangePicker"
      name="RangePicker"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <RangePicker />
    </Form.Item>

    <Form.Item
      wrapperCol={{ offset: 6, span: 16 }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default Create;
