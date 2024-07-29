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
} from "antd";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_USER_ID,
} from "../../emailConfig"; // Import email configuration
import styles from "../styles/layouts/Admin.module.scss"; // Import the SCSS module

const { Option } = Select;

function Admin() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUserKey, setEditUserKey] = useState(""); // Changed to editUserKey
  const [modalVisible, setModalVisible] = useState(false); // For modal visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
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

  const sendResetPasswordEmail = (email, resetLink) => {
    const templateParams = {
      to_name: email,
      from_name: "Your Company Name",
      message: `Click this link to reset your password: ${resetLink}`,
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

  const handleAddOrUpdateUser = async (values) => {
    const { email, role, status } = values;

    if (!email || !role || !status) {
      message.error(t("Please fill in all fields"));
      return;
    }

    try {
      const db = getDatabase();
      const userKey = editMode ? editUserKey : uuidv4();
      const userRef = ref(db, `users/${userKey}`);
      let userData = {
        id: userKey,
        email,
        password: "1234567", // Default password
        contact: "",
        cv_list: [
          {
            title: "",
            description: "",
            file: "",
            updatedAt: new Date().toISOString(),
          },
        ],
        role,
        status,
        createdAt: new Date().toISOString(),
        projetcIds: "",
        skill: "",
      };

      if (editMode) {
        await update(userRef, userData);
        message.success(t("User updated successfully!"));
      } else {
        const snapshot = await get(ref(db, "users"));
        const usersData = snapshot.val();
        const adminUsers = Object.values(usersData).filter(
          (user) => user.role === "admin"
        );

        if (role === "admin" && adminUsers.length === 0) {
          userData.isAdmin = true;
        }

        await set(userRef, userData);
        message.success(t("User added successfully!"));

        // Send reset password email
        const resetLink = `http://localhost:5173/reset-password?email=${encodeURIComponent(
          email
        )}`;
        sendResetPasswordEmail(email, resetLink);
      }

      form.resetFields();
      setEditMode(false);
      setEditUserKey("");

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
      message.error(t("Error adding or updating user"));
      console.error("Error adding or updating user: ", error);
    }
  };

  const handleDeleteUser = async (userKey) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userKey}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (userData.role === "Admin") {
        message.error(t("Cannot delete an admin user"));
        return;
      }

      if (userData.role === "Employee" && userData.status === "active") {
        message.error(t("Cannot delete an active employee"));
        return;
      }

      await remove(userRef);
      message.success(t("User deleted successfully!"));

      const updatedSnapshot = await get(ref(db, "users"));
      const updatedUserData = updatedSnapshot.val();
      if (updatedUserData) {
        setUsers(
          Object.entries(updatedUserData).map(([key, user]) => ({
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
    });
    setEditMode(true);
    setEditUserKey(user.key);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setModalVisible(false);
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
        Contact: user.contact,
        Skills: user.skill,
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
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      render: (text, user) => (
        <span className={styles["actions"]}>
          <Button
            onClick={() => handleEditUser(user)}
            key="edit"
            type="primary"
          >
            {t("Edit")}
          </Button>
          <Button
            type="danger"
            onClick={() => {
              if (user.role === "Admin") {
                message.error(t("Cannot delete an admin user"));
              } else if (user.status === "active" && user.role === "Employee") {
                message.error(t("Cannot delete an active employee"));
              } else {
                handleDeleteUser(user.key);
              }
            }}
            key="delete"
          >
            {t("Delete")}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className={styles["admin-page"]}>
      <h1>{t("Admin Page")}</h1>
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        className={styles["add-user-button"]}
      >
        {t("Add User")}
      </Button>
      <Button
        type="primary"
        onClick={handleExportExcel}
        className={styles["export-button"]}
      >
        {t("Export to Excel")}
      </Button>
      <Input
        className={styles["search-input"]}
        placeholder={t("Search by email")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table columns={columns} dataSource={paginatedUsers} pagination={false} />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredUsers.length}
        onChange={handlePageChange}
        className={styles["pagination"]}
      />
      <Modal
        title={editMode ? t("Edit User") : t("Add User")}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className={styles["modal"]}
      >
        <Form
          form={form}
          onFinish={handleAddOrUpdateUser}
          initialValues={{
            email: "",
            role: "Employee",
            status: "active",
          }}
          layout="vertical"
        >
          <Form.Item
            label={t("Email")}
            name="email"
            rules={[{ required: true, message: t("Please input your email!") }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("Role")}
            name="role"
            rules={[{ required: true, message: t("Please select a role!") }]}
          >
            <Select>
              <Option value="employee">{t("Employee")}</Option>
              <Option value="admin">{t("Admin")}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t("Status")}
            name="status"
            rules={[{ required: true, message: t("Please select a status!") }]}
          >
            <Select>
              <Option value="active">{t("Active")}</Option>
              <Option value="inactive">{t("Inactive")}</Option>
            </Select>
          </Form.Item>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editMode ? t("Update User") : t("Add User")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Admin;
