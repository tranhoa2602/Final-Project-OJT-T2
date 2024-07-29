import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        message.error(t("Failed to fetch programmingLanguages."));
      }
    };

    fetchTech();
  }, [id, form, t]);

  const handleSubmit = async (values) => {
    try {
      await axios.put(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`,
        values
      );
      message.success(t("Programming Languages updated successfully!"));
      navigate("/ViewLanguage");
    } catch (error) {
      console.error("Error updating Programming Languages: ", error);
      message.error(t("Failed to update Programming Languages."));
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
      <Title level={2}>{t("Edit Programming Languages")}</Title>
      <Form.Item
        label={t("Programming Language Name")}
        name="programingname"
        rules={[
          {
            required: true,
            message: t("Please input Programming Language Name!"),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("Programming Language Type")}
        name="programingtype"
        rules={[
          {
            required: true,
            message: t("Please input Programming Language Type!"),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("Programming Language Status")}
        name="programingstatus"
        rules={[
          {
            required: true,
            message: t("Please select Programming Language Status!"),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("Programming Language Description")}
        name="programingdescription"
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {t("Submit")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditLanguage;
