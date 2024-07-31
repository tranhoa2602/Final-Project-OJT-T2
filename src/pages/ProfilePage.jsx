import React, { useEffect, useState } from "react";
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
import { storage } from "../../firebaseConfig"; // Import storage từ cấu hình Firebase của bạn
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
      try {
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
      } catch (error) {
        console.error("Error fetching user data: ", error);
        message.error("Error fetching user data");
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
        const updatedData = { ...values, profilePicture: profilePicture || "" };
        await update(userRef, updatedData);
        message.success("Profile updated successfully");
        setUserData(updatedData);
      } else {
        message.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error updating profile: ", error); // Added logging
      message.error("Error updating profile");
    }
  };

  const handleProfilePictureChange = async ({ file }) => {
    if (!file) {
      message.error("No file selected");
      return;
    }

    try {
      const storageReference = storageRef(storage, `profilePictures/${file.name}`);
      await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(storageReference);
      console.log("File uploaded, download URL:", downloadURL);
      setProfilePicture(downloadURL);

      // Update profile picture URL in Firebase Realtime Database
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.key) {
        const db = getDatabase();
        const userRef = ref(db, `users/${storedUser.key}`);
        await update(userRef, { profilePicture: downloadURL });
        message.success("Profile picture updated successfully");
      } else {
        message.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error uploading profile picture: ", error);
      message.error("Error uploading profile picture");
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
