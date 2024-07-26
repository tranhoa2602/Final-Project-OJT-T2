import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Pagination } from "antd";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import styles from "../styles/layouts/Admin.module.scss"; // Import the SCSS module

const { Option } = Select;

function Admin() {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUserKey, setEditUserKey] = useState(""); // Changed to editUserKey
  const [modalVisible, setModalVisible] = useState(false); // For modal visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
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
        message.error("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  const handleAddOrUpdateUser = async (values) => {
    const { email, role, status } = values; // Remove password from the required fields

    if (!email || !role || !status) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      const db = getDatabase();
      const userKey = editMode ? editUserKey : uuidv4(); // Generate new key if not in edit mode
      const userRef = ref(db, `users/${userKey}`);
      let userData = {
        id: userKey,
        email,
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
        status, // Add status
        createdAt: new Date().toISOString(),
        projetcIds: "",
        skill: "",
      };

      if (editMode) {
        await update(userRef, userData);
        message.success("User updated successfully!");
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
        message.success("User added successfully!");
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
      message.error("Error adding or updating user");
      console.error("Error adding or updating user: ", error);
    }
  };

  const handleDeleteUser = async (userKey) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userKey}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      const adminUsers = users.filter((user) => user.isAdmin);

      if (userData.isAdmin && adminUsers.length === 1) {
        message.error("Cannot delete the only admin user");
        return;
      }

      if (userData.isAdmin) {
        message.error("Cannot delete an admin user");
        return;
      }

      await remove(userRef);
      message.success("User deleted successfully!");

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
      message.error("Error deleting user");
    }
  };

  const handleEditUser = (user) => {
    form.setFieldsValue({
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setEditMode(true);
    setEditUserKey(user.key); // Update to setEditUserKey
    setModalVisible(true); // Open modal for editing
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
        Role: user.role,
        CreatedAt: user.createdAt,
        Contact: user.contact,
        Skills: user.skill,
        Status: user.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={styles["admin-page"]}>
      <h1>Admin Page</h1>
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        className={styles["add-user-button"]}
      >
        Add User
      </Button>
      <Button
        type="primary"
        onClick={handleExportExcel}
        className={styles["export-button"]}
      >
        Export to Excel
      </Button>
      <Modal
        title={editMode ? "Edit User" : "Add User"}
        open={modalVisible} // Updated
        onCancel={handleModalCancel}
        footer={null}
        className={styles["modal"]}
      >
        <Form
          form={form}
          onFinish={handleAddOrUpdateUser}
          initialValues={{
            email: "",
            role: "employee",
            status: "active",
          }} // Add status
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select>
              <Option value="employee">Employee</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editMode ? "Update User" : "Add User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <h2>Current Users</h2>
      <table className={styles["user-table"]}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.key}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={
                    user.status === "active"
                      ? styles["status-active"]
                      : styles["status-inactive"]
                  }
                >
                  {user.status}
                </span>
              </td>
              <td className={styles["actions"]}>
                <Button
                  onClick={() => handleEditUser(user)}
                  key="edit"
                  type="primary"
                >
                  Edit
                </Button>
                {!user.isAdmin && (
                  <Button
                    type="danger"
                    onClick={() => handleDeleteUser(user.key)}
                    key="delete"
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={users.length}
        onChange={handlePageChange}
        className={styles["pagination"]}
      />
    </div>
  );
}

export default Admin;
