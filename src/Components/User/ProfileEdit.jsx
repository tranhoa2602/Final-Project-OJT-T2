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
  Spin,
  Tag,
} from "antd";
import { getDatabase, ref, get, update } from "firebase/database";
import { storage } from "../../../firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import BackButton from "../layouts/BackButton";
import exportEmployeeCV from "../Employee/Employee_Information/EmployeeCV"; // Ensure this path is correct
import styles from "../../styles/layouts/ProfileEdit.module.scss";

const { Option } = Select;
const { TextArea } = Input;

const ProfileEdit = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [tempProfilePicture, setTempProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.key) {
          const db = getDatabase();
          let userRef = ref(db, `users/${storedUser.key}`);
          let snapshot = await get(userRef);

          if (!snapshot.exists()) {
            userRef = ref(db, `employees/${storedUser.key}`);
            snapshot = await get(userRef);
          }

          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(data);
            setProfilePicture(data.profilePicture);
            form.setFieldsValue(data);
            fetchProjects(data.projects || []);
          } else {
            message.error(t("User data not found"));
            navigate("/");
          }
        } else {
          message.error(t("User not authenticated"));
          navigate("/");
        }
      } catch (error) {
        console.error(t("Error fetching user data: "), error);
        message.error(t("Error fetching user data"));
      }
    };

    const fetchProjects = async (projectIds) => {
      const db = getDatabase();
      const projectsRef = ref(db, "projects");
      const snapshot = await get(projectsRef);

      if (snapshot.exists()) {
        const allProjects = snapshot.val();
        const assignedProjects = projectIds.map(
          (projId) => allProjects[projId]
        );
        setProjects(assignedProjects);
      }
    };

    fetchUserData();
  }, [form, navigate, t]);

  const handleUpdate = async (values) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.key) {
        const db = getDatabase();
        let userRef = ref(db, `users/${storedUser.key}`);
        let snapshot = await get(userRef);

        if (!snapshot.exists()) {
          userRef = ref(db, `employees/${storedUser.key}`);
        }

        // Remove the email field from the values to prevent updating it
        const { email, ...updatedData } = values;
        updatedData.profilePicture = profilePicture || "";

        await update(userRef, updatedData);
        message.success(t("Profile updated successfully"));
        setUserData(updatedData);
        navigate("/profile");
      } else {
        message.error(t("User not authenticated"));
      }
    } catch (error) {
      console.error(t("Error updating profile: "), error);
      message.error(t("Error updating profile"));
    }
  };

  const handleProfilePictureChange = ({ file }) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error(t("You can only upload JPG/PNG files!"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempProfilePicture(file);
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfilePictureUpload = async () => {
    try {
      if (!tempProfilePicture) {
        message.warning(t("No picture to upload"));
        return;
      }

      setLoading(true);

      const storageReference = storageRef(
        storage,
        `profilePictures/${tempProfilePicture.name}`
      );
      const snapshot = await uploadBytes(storageReference, tempProfilePicture);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setProfilePicture(downloadURL);
      setTempProfilePicture(null);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.key) {
        const db = getDatabase();
        let userRef = ref(db, `users/${storedUser.key}`);
        let snapshot = await get(userRef);

        if (!snapshot.exists()) {
          userRef = ref(db, `employees/${storedUser.key}`);
        }

        await update(userRef, { profilePicture: downloadURL });
        message.success(t("Profile picture updated successfully"));
      } else {
        message.error(t("User not authenticated"));
      }
    } catch (error) {
      console.error(t("Error uploading profile picture: "), error);
      message.error(t("Error uploading profile picture"));
    } finally {
      setLoading(false);
    }
  };

  const handleExportCV = () => {
    exportEmployeeCV({
      ...userData,
      specification: form.getFieldValue("specification"),
      experience: form.getFieldValue("experience"),
      projects,
    });
  };

  if (!userData) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div className={styles.profilePage}>
      <BackButton />
      <Card title={t("Profile Edit")} className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <Spin spinning={loading}>
            <Avatar size={100} src={profilePicture} />
          </Spin>
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
          {tempProfilePicture && (
            <Button
              type="primary"
              onClick={handleProfilePictureUpload}
              className={styles.confirmUploadButton}
            >
              {t("Confirm Upload")}
            </Button>
          )}
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
            name="specification"
            label={t("Specification")}
            rules={[
              {
                required: true,
                message: t("Please input your specification!"),
              },
            ]}
          >
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label={t("Projects")}>
            {projects.map((project) => (
              <Card key={project.name} className={styles.projectCard}>
                <p>
                  <strong>{t("Project Name")}: </strong>
                  {project.name}
                </p>
                <p>
                  <strong>{t("Role")}: </strong>
                  {userData.positionName}
                </p>
                <p>
                  <strong>{t("Description")}: </strong>
                  {project.description}
                </p>
                <p>
                  <strong>{t("Specification")}: </strong>
                  {form.getFieldValue("specification")}
                </p>
                <p>
                  <strong>{t("Languages and Framework")}: </strong>
                  {project.programmingLanguage}
                </p>
                <p>
                  <strong>{t("Technologies")}: </strong>
                  {project.technology}
                </p>
              </Card>
            ))}
          </Form.Item>
          <div className={styles.buttonsContainer}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.updateButton}
            >
              {t("Update Profile")}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileEdit;
