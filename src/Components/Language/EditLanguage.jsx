import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message, Switch, Select } from "antd";
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
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Programming Languages: ", error);
        message.error(t("Failed to fetch programming languages."));
        setLoading(false);
      }
    };

    fetchLanguage();
  }, [id, form, t]);

  const handleSubmit = async (values) => {
    try {
      values.programingstatus = values.programingstatus ? "Active" : "Inactive";

      await axios.put(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`,
        values
      );
      message.success(t("Programming language updated successfully!"));
      navigate("/ViewLanguage");
    } catch (error) {
      console.error("Error updating Programming Language: ", error);
      message.error(t("Failed to update programming language."));
    }
  };

  const handleFailure = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (loading) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={handleSubmit}
      onFinishFailed={handleFailure}
      style={{ height: "100vh" }}
      initialValues={initialValues}
    >
      <Title level={2}>{t("Edit Programming Language")}</Title>
      <Form.Item
        label={t("Program Language Name")}
        name="programingname"
        rules={[{ required: true, message: t("Please input Program Language Name!") }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("Program Language Type")}
        name="programingtype"
        rules={[{ required: true, message: t("Please input Program Language Type!") }]}
      >
        <Select mode="tags" style={{ width: "100%" }} placeholder={t("Tags Mode")} />
      </Form.Item>
      <Form.Item
        label={t("Program Language Status")}
        name="programingstatus"
        valuePropName="checked"
      >
        <Switch checkedChildren={t("Active")} unCheckedChildren={t("Inactive")} />
      </Form.Item>
      <Form.Item label={t("Program Language Description")} name="programingdescription">
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {t("Submit")}
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => navigate("/ViewLanguage")}
        >
          {t("Back to Programing Language List")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditLanguage;
