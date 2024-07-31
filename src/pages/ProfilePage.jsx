import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Card,
  Row,
  Col,
  Avatar,
  Upload,
} from "antd";
import { getDatabase, ref, get, update } from "firebase/database";
import { storage } from "../../firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import styles from "../styles/layouts/ProfilePage.module.scss";

const { Option } = Select;
const { TextArea } = Input;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.key) {
        const db = getDatabase();
        const userRef = ref(db, `users/${storedUser.key}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setProfilePicture(data.profilePicture);
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
      if (storedUser && storedUser.key) {
        const db = getDatabase();
        const userRef = ref(db, `users/${storedUser.key}`);
        await update(userRef, { ...values, profilePicture });
        message.success("Profile updated successfully");
        setUserData({ ...values, profilePicture });
      } else {
        message.error("User not authenticated");
      }
    } catch (error) {
      message.error("Error updating profile");
    }
  };

  const handleProfilePictureChange = async (info) => {
    const file = info.file.originFileObj;
    if (file) {
      const storageReference = storageRef(
        storage,
        `profilePictures/${file.name}`
      );
      await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(storageReference);
      setProfilePicture(downloadURL);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <Card title={t("Profile Page")} className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <Avatar size={100} src={profilePicture} />
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleProfilePictureChange}
          >
            <Button
              icon={<UploadOutlined />}
              className={styles.changePictureButton}
              style={{ marginLeft: "10px" }}
            >
              {t("Change Picture")}
            </Button>
          </Upload>
        </div>
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t("Name")}
                rules={[
                  { required: true, message: t("Please input your name!") },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={t("Phone")}
                rules={[
                  { required: true, message: t("Please input your phone!") },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label={t("Email")}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label={t("Role")}>
                <Select disabled>
                  <Option value="Employee">{t("Employee")}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t("Status")}
                rules={[
                  { required: true, message: t("Please select a status!") },
                ]}
              >
                <Select>
                  <Option value="active">{t("Active")}</Option>
                  <Option value="inactive">{t("Inactive")}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="skill"
                label={t("Skills")}
                rules={[
                  { required: true, message: t("Please input your skills!") },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="address"
            label={t("Address")}
            rules={[
              { required: true, message: t("Please input your address!") },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="experience"
            label={t("Work Experience")}
            rules={[
              {
                required: true,
                message: t("Please input your work experience!"),
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="education"
            label={t("Education")}
            rules={[
              { required: true, message: t("Please input your education!") },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {t("Update Profile")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
