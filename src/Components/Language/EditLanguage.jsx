import React, { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message, Switch, Select, Spin } from "antd";
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
  const [existingTypes, setExistingTypes] = useState([]);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
        );
        const data = response.data;
        data.programingstatus = data.programingstatus === "Active";
        data.deletestatus = data.deletestatus !== undefined ? data.deletestatus : false; // Ensure deletestatus is present
        setInitialValues(data);
        form.setFieldsValue(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Programming Languages: ", error);
        message.error(t("Failed to fetch programming languages."));
        setLoading(false);
      }
    };

    const fetchExistingTypes = async () => {
      try {
        const response = await axios.get(`${firebaseConfig.databaseURL}/programmingLanguages.json`);
        const types = response.data
          ? Object.values(response.data).map(lang => lang.programingtype).flat()
          : [];
        setExistingTypes([...new Set(types)]);
      } catch (error) {
        console.error("Error fetching existing types: ", error);
      }
    };

    fetchLanguage();
    fetchExistingTypes();
  }, [id, form, t]);

  const handleSubmit = async (values) => {
    setLoading(true); // Start loading
    try {
      values.programingstatus = values.programingstatus ? "Active" : "Inactive";
      values.deletestatus = false; // Set deletestatus to false

      await axios.put(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`,
        values
      );
      message.success(t("Programming language updated successfully!"));
      navigate("/ViewLanguage");
    } catch (error) {
      console.error("Error updating Programming Language: ", error);
      message.error(t("Failed to update programming language."));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleFailure = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validateDescription = (_, value) => {
    const wordCount = value ? value.split(' ').filter(word => word).length : 0;
    return wordCount <= 20 ? Promise.resolve() : Promise.reject(new Error(t("Description cannot exceed 20 words")));
  };

  return (
    <Spin spinning={loading} tip={t("Loading...")} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={handleFailure}
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
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder={t("Tags Mode")}
            options={existingTypes.map(type => ({ value: type }))}
          />
        </Form.Item>
        <Form.Item
          label={t("Program Language Status")}
          name="programingstatus"
          valuePropName="checked"
          rules={[{ required: true, message: t("Please select Programming Language Status!") }]}
        >
          <Switch checkedChildren={t("Active")} unCheckedChildren={t("Inactive")} />
        </Form.Item>
        <Form.Item
          label={t("Program Language Description")}
          name="programingdescription"
          rules={[{ validator: validateDescription }]}
        >
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
            {t("Back to Programming Language List")}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default EditLanguage;
