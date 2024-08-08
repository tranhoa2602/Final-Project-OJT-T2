import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, Avatar, message, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "../../../styles/layouts/EmployeeList.module.scss";
import "../../../styles/layouts/tablestyles.css";

const defaultAvatarUrl =
  "https://firebasestorage.googleapis.com/v0/b/ojt-final-project.appspot.com/o/profilePictures%2FdefaultAvatars.jpg?alt=media&token=32a0e3f9-039b-4041-92d0-c248f78cedd9"; // Replace with your actual default avatar URL

const columns = (handleRestore, handleDelete, navigate, t) => [
  {
    title: t("Profile Picture"),
    dataIndex: "profilePicture",
    key: "profilePicture",
    render: (text, record) => (
      <Avatar src={record.profilePicture || defaultAvatarUrl} size={64} />
    ),
  },
  {
    title: t("Name"),
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <a onClick={() => navigate("/details", { state: { employee: record } })}>
        {text}
      </a>
    ),
  },
  {
    title: t("Email"),
    dataIndex: "email",
    key: "email",
  },
  {
    title: t("Position"),
    dataIndex: "positionName",
    key: "positionName",
  },
  {
    title: t("Status"),
    key: "status",
    dataIndex: "status",
    render: (_, { status }) => (
      <Tag color="volcano">
        {status === "active" ? t("Active") : t("Inactive")}
      </Tag>
    ),
  },
  {
    title: t("Actions"),
    key: "actions",
    align: "center",
    render: (_, record) => (
      <div className={styles["actions-container"]}>
        <Button
          onClick={() => handleRestore(record)}
          type="primary"
          icon={<EditOutlined />}
          className={styles["restore-button"]}
        >
          {t("Restore")}
        </Button>
        <Button
          type="default"
          onClick={() => navigate("/details", { state: { employee: record } })}
          icon={<InfoCircleOutlined />}
          className={styles["detail-button"]}
        >
          {t("Detail")}
        </Button>
        <Button
          type="default" danger
          onClick={() => handleDelete(record)}
          icon={<DeleteOutlined />}
          className={styles["delete-button"]}
        >
          {t("Delete")}
        </Button>
      </div>
    ),
  },
];

const fetchData = async () => {
  const db = getDatabase();
  const employeesRef = ref(db, "employees");

  const employeesSnapshot = await get(employeesRef);
  const employees = employeesSnapshot.exists() ? employeesSnapshot.val() : {};

  const employeesArray = Object.entries(employees)
    .filter(([key, value]) => value.deleteStatus) // Filter for deleted employees
    .map(([key, value]) => ({
      key,
      ...value,
    }));

  return employeesArray;
};

const EmployeeBin = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const employees = await fetchData();
      setEmployees(employees);
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchDataAndSetState();
  }, []);

  const handleRestore = async (employee) => {
    try {
      const db = getDatabase();
      const employeeRef = ref(db, `employees/${employee.key}`);
      await update(employeeRef, { deleteStatus: false });
      const employees = await fetchData(); // Refresh the list
      setEmployees(employees);
      message.success(t("Employee restored successfully"));
    } catch (error) {
      console.error("Error restoring employee:", error);
      message.error(t("Failed to restore employee"));
    }
  };

  const handleDelete = async (employee) => {
    try {
      const db = getDatabase();
      await remove(ref(db, `employees/${employee.key}`));
      const employees = await fetchData(); // Refresh the list
      setEmployees(employees);
      message.success(t("Employee deleted permanently"));
    } catch (error) {
      console.error("Error deleting employee:", error);
      message.error(t("Failed to delete employee"));
    }
  };

  return (
    <div className={styles["employee-bin"]}>
      <Space className={styles["actions-container"]}>
        <Button
          type="default"
          onClick={() => navigate("/list")}
          className={styles["back-button"]}
        >
          {t("Back to List")}
        </Button>
      </Space>

      <h1 className="title">{t("EMPLOYEES BIN")}</h1>

      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={columns(handleRestore, handleDelete, navigate, t)}
          dataSource={employees}
          rowKey="key"
          pagination={{ pageSize: 6 }}
          className={styles["employee-table"]}
          components={{
            header: {
              cell: (props) => (
                <th {...props} className={`table-header ${props.className}`}>
                  {props.children}
                </th>
              ),
            },
          }}
        />
      )}
    </div>
  );
};

export default EmployeeBin;
