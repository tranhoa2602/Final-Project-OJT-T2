import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
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

const EditLanguage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
        );
        setInitialValues(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error("Error fetching Programming Languages: ", error);
        message.error("Failed to fetch Programming Languages.");
      }
    };

    fetchTech();
  }, [id, form]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`,
        values
      );
      message.success("Programming Languages updated successfully!");
      navigate("/ViewLanguage");
    } catch (error) {
      console.error("Error updating Programming Languages: ", error);
      message.error("Failed to update Programming Languages.");
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
      <Title level={2}> Edit Programming Languages </Title>{" "}
      <Form.Item
        label="Programming Languages Name"
        name="programingname"
        rules={[
          {
            required: true,
            message: "Please input Programming Languages Name!",
          },
        ]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        label="Programming Languages Type"
        name="programingtype"
        rules={[
          {
            required: true,
            message: "Please input Programming Languages Type!",
          },
        ]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        label="Programming Languages Status"
        name="programingstatus"
        rules={[
          {
            required: true,
            message: "Please select Programming Languages Status!",
          },
        ]}
      >
        <Input />
      </Form.Item>{" "}
      <Form.Item
        label="Programming Languages Description"
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

export default EditLanguage;
