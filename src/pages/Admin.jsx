import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Pagination,
  Table,
  Tag,
  Avatar,
  Upload,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "../../emailConfig"; // Import email configuration
import styles from "../styles/layouts/Admin.module.scss"; // Import the SCSS module

const { Option } = Select;

const defaultAvatarUrl =
  "https://firebasestorage.googleapis.com/v0/b/ojt-final-project.appspot.com/o/profilePictures%2FdefaultAvatars.jpg?alt=media&token=32a0e3f9-039b-4041-92d0-c248f78cedd9"; // Replace with your actual default avatar URL

function Admin() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editUserKey, setEditUserKey] = useState(""); // Changed to editUserKey
  const [addModalOpen, setAddModalOpen] = useState(false); // For Add User modal visibility
  const [editModalOpen, setEditModalOpen] = useState(false); // For Edit User modal visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempProfilePicture, setTempProfilePicture] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, "users");
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        if (userData) {
          setUsers(
            Object.entries(userData).map(([key, user]) => ({ ...user, key }))
          );
        }
      } catch (error) {
        message.error(t("Error fetching users"));
      }
    };

    fetchUsers();
  }, [t]);

  const sendVerificationEmail = (email, verifyLink) => {
    const templateParams = {
      to_name: email,
      from_name: "Your Company Name",
      message: `Click this link to verify your account: ${verifyLink}`,
    };

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  const handleAddUser = async (values) => {
    const { email, role } = values;

    if (!email || !role) {
      message.error(t("This email already exists"));
      return;
    }

    if (role !== "Admin") {
      message.error(t("Only Admin role can be created from this page"));
      return;
    }

    try {
      const db = getDatabase();
      const userRef = ref(db, "users");
      const snapshot = await get(userRef);
      const userData = snapshot.val() || {};

      // Check for duplicate email
      const duplicateEmail = Object.values(userData).some(
        (user) => user.email === email
      );

      if (duplicateEmail) {
        message.error(t("This email already exists"));
        return;
      }

      const userKey = uuidv4();
      const verificationToken = uuidv4(); // Generate a unique token for verification
      const newUserRef = ref(db, `users/${userKey}`);
      const newUserData = {
        id: userKey,
        email,
        password: "1234567", // Default password
        role,
        status: "inactive", // Set default status to inactive
        createdAt: new Date().toISOString(),
        verificationToken, // Add the verification token to user data
      };

      await set(newUserRef, newUserData);
      message.success(t("User added successfully!"));

      // Send verification email
      const verifyLink = `http://localhost:5173/verify-account?email=${encodeURIComponent(
        email
      )}&token=${verificationToken}`;
      sendVerificationEmail(email, verifyLink);

      form.resetFields();
      setAddModalOpen(false);

      const updatedSnapshot = await get(ref(db, "users"));
      const updatedUserData = updatedSnapshot.val();
      if (updatedUserData) {
        setUsers(
          Object.entries(updatedUserData).map(([key, user]) => ({
            ...user,
            key,
          }))
        );
      }
    } catch (error) {
      message.error(t("Error adding user"));
      console.error("Error adding user: ", error);
    }
  };

  const handleUpdateUser = async (values) => {
    const { email, role, status } = values;

    if (!email || !role || !status) {
      message.error(t("This email already exists"));
      return;
    }

    try {
      const db = getDatabase();
      const userKey = editUserKey;
      const userRef = ref(db, `users/${userKey}`);
      const userDataToUpdate = {
        id: userKey,
        email,
        role,
        status,
        name: values.name,
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
      message.success(t("User updated successfully!"));

      form.resetFields();
      setEditMode(false);
      setEditUserKey("");
      setEditModalOpen(false);

      const updatedSnapshot = await get(ref(db, "users"));
      const fetchedUserData = updatedSnapshot.val();
      if (fetchedUserData) {
        setUsers(
          Object.entries(fetchedUserData).map(([key, user]) => ({
            ...user,
            key,
          }))
        );
      }
    } catch (error) {
      message.error(t("Error updating user"));
      console.error("Error updating user: ", error);
    }
  };

  const handleDeleteUser = async (userKey) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userKey}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (userData.role === "Admin" && userData.status === "active") {
        message.error(t("Cannot delete an active admin"));
        return;
      }

      await remove(userRef);
      message.success(t("User deleted successfully!"));

      const updatedSnapshot = await get(ref(db, "users"));
      const fetchedUserData = updatedSnapshot.val();
      if (fetchedUserData) {
        setUsers(
          Object.entries(fetchedUserData).map(([key, user]) => ({
            ...user,
            key,
          }))
        );
      } else {
        setUsers([]);
      }
    } catch (error) {
      message.error(t("Error deleting user"));
    }
  };

  const handleEditUser = (user) => {
    form.setFieldsValue({
      email: user.email,
      role: user.role,
      status: user.status,
      name: user.name,
    });
    setProfilePicture(user.profilePicture || defaultAvatarUrl);
    setEditMode(true);
    setEditUserKey(user.key);
    setEditModalOpen(true);
  };

  const handleAddModalCancel = () => {
    form.resetFields();
    setAddModalOpen(false);
  };

  const handleEditModalCancel = () => {
    form.resetFields();
    setEditModalOpen(false);
    setEditMode(false);
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        Email: user.email,
        Role: t(user.role),
        CreatedAt: user.createdAt,
        Status: t(user.status),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: t("Profile Picture"),
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (text, record) => (
        <Avatar src={record.profilePicture || defaultAvatarUrl} size={64} />
      ),
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("Role"),
      dataIndex: "role",
      key: "role",
      filters: [
        { text: t("Admin"), value: "Admin" },
        { text: t("Employee"), value: "Employee" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => t(role.charAt(0).toUpperCase() + role.slice(1)),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      filters: [
        { text: t("Active"), value: "active" },
        { text: t("Inactive"), value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) =>
        status ? (
          <Tag color={status === "active" ? "green" : "red"}>
            {t(status.charAt(0).toUpperCase() + status.slice(1))}
          </Tag>
        ) : null,
    },
    {
      title: t("Actions"),
      key: "actions",
      align: "center",
      render: (text, user) => (
        <div className={styles["actions-container"]}>
          <Button
            onClick={() => handleEditUser(user)}
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            className={styles["edit-button"]}
          >
            {t("Edit")}
          </Button>
          <Button
            type="danger"
            onClick={() => {
              Modal.confirm({
                title: t("Are you sure you want to delete this user?"),
                onOk: () => handleDeleteUser(user.key),
              });
            }}
            key="delete"
            icon={<DeleteOutlined />}
            className={styles["delete-button"]}
          >
            {t("Delete")}
          </Button>
        </div>
      ),
    },
  ];

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
    <div className={styles["admin-page"]}>
      <h1>{t("Admin Page")}</h1>
      <div className={styles["search-bar"]}>
        <Input.Search
          placeholder={t("Search by Email")}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles["search-input"]}
        />
      </div>
      <div className={styles["actions-container"]}>
        <Button
          type="primary"
          onClick={() => setAddModalOpen(true)}
          className={styles["add-user-button"]}
        >
          {t("Add User")}
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={handleExportExcel}
          className={styles["export-button"]}
        >
          {t("Export to Excel")}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={paginatedUsers}
        pagination={false}
        className={styles["user-table"]}
        rowKey="key"
        rowClassName={(record) =>
          record.IsExist === "false" ? styles["inactive-user-row"] : ""
        } // Apply class for inactive users
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredUsers.length}
        onChange={handlePageChange}
        className={styles["pagination"]}
      />

      <Modal
        title={t("Add User")}
        open={addModalOpen}
        onCancel={handleAddModalCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={handleAddUser} layout="vertical">
          <Form.Item
            name="email"
            label={t("Email")}
            rules={[
              { required: true, message: t("Please input your email!") },
              {
                validator: (_, value) =>
                  value && validateEmail(value)
                    ? Promise.resolve()
                    : Promise.reject(t("Please enter a valid email address")),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label={t("Role")}
            initialValue="Admin"
            rules={[{ required: true, message: t("Please select a role!") }]}
          >
            <Select disabled>
              <Option value="Admin">{t("Admin")}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label={t("Status")}
            initialValue="inactive"
            rules={[{ required: true, message: t("Please select a status!") }]}
          >
            <Select disabled>
              <Option value="active">{t("Active")}</Option>
              <Option value="inactive">{t("Inactive")}</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {t("Add User")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("Edit User")}
        open={editModalOpen}
        onCancel={handleEditModalCancel}
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
                      : Promise.reject(t("Please enter a valid email address")),
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="role"
              label={t("Role")}
              initialValue="Admin"
              rules={[{ required: true, message: t("Please select a role!") }]}
            >
              <Select disabled>
                <Option value="Admin">{t("Admin")}</Option>
              </Select>
            </Form.Item>
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
            <Form.Item name="name" label={t("Name")}>
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
                {t("Update User")}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

export default Admin;
