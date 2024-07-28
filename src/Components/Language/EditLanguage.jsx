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

const EditLanguage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
        );
        const data = response.data;
        data.programingstatus = data.programingstatus === "Active";
        setInitialValues(data);
        form.setFieldsValue(data);
      } catch (error) {
        console.error("Error fetching Programming Languages: ", error);
        message.error("Failed to fetch Programming Languages.");
      }
    };

    fetchLanguage();
  }, [id, form]);

  const handleSubmit = async (values) => {
    try {
      values.programingstatus = values.programingstatus ? "Active" : "Inactive";

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
      <Title level={2}>Edit Technology</Title>
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
        rules={[{ required: true, message: "Please input ProgramLanguage Type!" }]}
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

export default EditLanguage;
