import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Avatar,
  Upload,
  Spin,
} from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { get, getDatabase, ref, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import styles from "../styles/layouts/Admin.module.scss"; // Import the SCSS module

const defaultAvatarUrl =
  "https://firebasestorage.googleapis.com/v0/b/ojt-final-project.appspot.com/o/profilePictures%2FdefaultAvatars.jpg?alt=media&token=32a0e3f9-039b-4041-92d0-c248f78cedd9"; // Replace with your actual default avatar URL

function Admin() {
  const { t } = useTranslation();
  const [form] = Form.useForm(); // Create form instance
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempProfilePicture, setTempProfilePicture] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.key) {
          const db = getDatabase();
          const userRef = ref(db, `users/${storedUser.key}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          if (userData) {
            setUser(userData);
            form.setFieldsValue(userData);
            setProfilePicture(userData.profilePicture || defaultAvatarUrl);

            // Lưu chỉ key và role vào localStorage
            const userStorageData = {
              key: storedUser.key,
              role: userData.role,
            };
            localStorage.setItem("user", JSON.stringify(userStorageData));
          }
        } else {
          message.error(t("User not authenticated"));
          navigate("/");
        }
      } catch (error) {
        message.error(t("Error fetching user data"));
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUser();
  }, [form, navigate, t]);

  const handleUpdateUser = async (values) => {
    try {
      const db = getDatabase();
      const userKey = user.id;
      const userRef = ref(db, `users/${userKey}`);
      const userDataToUpdate = {
        ...user,
        ...values,
        updatedAt: new Date().toISOString(),
      };

      if (tempProfilePicture) {
        setLoading(true);
        const storage = getStorage();
        const storageReference = storageRef(
          storage,
          `profilePictures/${tempProfilePicture.name}`
        );
        const snapshot = await uploadBytes(
          storageReference,
          tempProfilePicture
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        userDataToUpdate.profilePicture = downloadURL;
        setProfilePicture(downloadURL);
        setTempProfilePicture(null);
        setLoading(false);
      }

      await update(userRef, userDataToUpdate);
      message.success(t("Profile updated successfully!"));

      setUser(userDataToUpdate);
      // Lưu chỉ key và role vào localStorage
      const userStorageData = {
        key: userKey,
        role: userDataToUpdate.role,
      };
      localStorage.setItem("user", JSON.stringify(userStorageData));
      setEditModalOpen(false);
    } catch (error) {
      message.error(t("Error updating profile"));
      console.error("Error updating profile: ", error);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
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
        getStorage(),
        `profilePictures/${tempProfilePicture.name}`
      );
      const snapshot = await uploadBytes(storageReference, tempProfilePicture);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File uploaded, download URL:", downloadURL);
      setProfilePicture(downloadURL);
      setTempProfilePicture(null);

      // Update profile picture URL in Firebase Realtime Database
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.key) {
        const db = getDatabase();
        const userRef = ref(db, `users/${storedUser.key}`);
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

  return (
    <div className={styles["profile-detail-page"]}>
      {user && (
        <>
          <h1 className={styles["page-title"]}>{t("Admin Profile")}</h1>
          <div className={styles["profile-header"]}>
            <Avatar
              src={profilePicture || defaultAvatarUrl}
              size={250}
              className={styles["profile-avatar"]}
            />
            <div className={styles["profile-info"]}>
              <h2 className={styles["profile-name"]}>{user.name}</h2>
              <p className={styles["profile-email"]}>{user.email}</p>
              <Button
                type="primary"
                onClick={() => setEditModalOpen(true)}
                icon={<EditOutlined />}
                className={styles["edit-button"]}
              >
                {t("Edit Profile")}
              </Button>
            </div>
          </div>
          <div className={styles["profile-details"]}>
            <p>
              <strong>{t("Phone")}:</strong> {user.phone}
            </p>
            <p>
              <strong>{t("Role")}:</strong> {t(user.role)}
            </p>
            <p>
              <strong>{t("Status")}:</strong> {user.status}
            </p>
          </div>
          <Modal
            title={t("Edit Profile")}
            open={editModalOpen}
            onCancel={() => setEditModalOpen(false)}
            footer={null}
            destroyOnClose={true}
          >
            <Spin spinning={loading}>
              <Form form={form} onFinish={handleUpdateUser} layout="vertical">
                <Form.Item
                  name="email"
                  label={t("Email")}
                  rules={[
                    { required: true, message: t("Please input your email!") },
                    {
                      validator: (_, value) =>
                        value && validateEmail(value)
                          ? Promise.resolve()
                          : Promise.reject(
                              t("Please enter a valid email address")
                            ),
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  name="name"
                  label={t("Name")}
                  rules={[
                    { required: true, message: t("Please input your name!") },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={t("Phone")}
                  rules={[
                    {
                      required: true,
                      message: t("Please input your phone number!"),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label={t("Profile Picture")} valuePropName="file">
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleProfilePictureChange}
                  >
                    <Button icon={<UploadOutlined />}>
                      {t("Change Profile Picture")}
                    </Button>
                  </Upload>
                  {tempProfilePicture && (
                    <Button
                      type="primary"
                      onClick={handleProfilePictureUpload}
                      className={styles.confirmUploadButton}
                      style={{ marginTop: "10px" }}
                    >
                      {t("Confirm Upload")}
                    </Button>
                  )}
                  {profilePicture && (
                    <Avatar
                      src={profilePicture}
                      size={100}
                      style={{ marginTop: "10px" }}
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    {t("Update Profile")}
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        </>
      )}
    </div>
  );
}

export default Admin;
