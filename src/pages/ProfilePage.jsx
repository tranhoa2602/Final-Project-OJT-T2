import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Card } from "antd";
import { getDatabase, ref, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.id) {
        const db = getDatabase();
        const userRef = ref(db, `users/${storedUser.id}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          form.setFieldsValue(data);
        } else {
          message.error("User data not found");
          navigate("/");
        }
      } else {
        message.error("User not authenticated");
        navigate("/");
      }
    };

    fetchUserData();
  }, [form, navigate]);

  const handleUpdate = async (values) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.id) {
        const db = getDatabase();
        const userRef = ref(db, `users/${storedUser.id}`);
        await update(userRef, values);
        message.success("Profile updated successfully");
        setUserData(values);
      } else {
        message.error("User not authenticated");
      }
    } catch (error) {
      message.error("Error updating profile");
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Card title={t("Profile Page")} style={{ maxWidth: 600, margin: "auto" }}>
      <Form form={form} onFinish={handleUpdate} layout="vertical">
        <Form.Item
          name="name"
          label={t("Name")}
          rules={[{ required: true, message: t("Please input your name!") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label={t("Phone")}
          rules={[{ required: true, message: t("Please input your phone!") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role"
          label={t("Role")}
          rules={[{ required: true, message: t("Please select a role!") }]}
        >
          <Select disabled>
            <Option value="Employee">{t("Employee")}</Option>
            <Option value="Admin">{t("Admin")}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label={t("Status")}
          rules={[{ required: true, message: t("Please select a status!") }]}
        >
          <Select>
            <Option value="active">{t("Active")}</Option>
            <Option value="inactive">{t("Inactive")}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="contact"
          label={t("Contact")}
          rules={[{ required: true, message: t("Please input your contact!") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="skills"
          label={t("Skills")}
          rules={[{ required: true, message: t("Please input your skills!") }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("Update Profile")}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfilePage;
