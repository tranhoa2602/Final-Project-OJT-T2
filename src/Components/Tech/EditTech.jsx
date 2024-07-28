import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message, Switch, Select } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";

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

const EditTech = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/technologies/${id}.json`
        );
        const data = response.data;
        data.techstatus = data.techstatus === "Active";
        setInitialValues(data);
        form.setFieldsValue(data);
      } catch (error) {
        console.error("Error fetching technology: ", error);
        message.error("Failed to fetch technology.");
      }
    };

    fetchTech();
  }, [id, form]);

  const handleSubmit = async (values) => {
    try {
      values.techstatus = values.techstatus ? "Active" : "Inactive";

      await axios.put(
        `${firebaseConfig.databaseURL}/technologies/${id}.json`,
        values
      );
      message.success("Technology updated successfully!");
      navigate("/TechList");
    } catch (error) {
      console.error("Error updating technology: ", error);
      message.error("Failed to update technology.");
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
      initialValues={initialValues}
    >
      <Title level={2}>Edit Technology</Title>
      <Form.Item
        label="TechName"
        name="techname"
        rules={[{ required: true, message: "Please input Tech Name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="TechType"
        name="techtype"
        rules={[{ required: true, message: "Please input Tech Type!" }]}
      >
        <Select mode="tags" style={{ width: "100%" }} placeholder="Tags Mode" />
      </Form.Item>
      <Form.Item
        label="TechStatus"
        name="techstatus"
        valuePropName="checked"
        rules={[{ required: true, message: "Please select Tech Status!" }]}
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
      <Form.Item label="TechDescription" name="techdescription">
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

export default EditTech;
