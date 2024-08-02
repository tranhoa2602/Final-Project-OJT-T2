import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, Input, Avatar, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "../../../styles/layouts/EmployeeList.module.scss";

const defaultAvatarUrl =
  "https://firebasestorage.googleapis.com/v0/b/ojt-final-project.appspot.com/o/profilePictures%2FdefaultAvatars.jpg?alt=media&token=32a0e3f9-039b-4041-92d0-c248f78cedd9"; // Replace with your actual default avatar URL

const columns = (handleEdit, handleDelete, navigate, positions, projects, t) => [
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
    render: (_, { status }) => {
      const statusArray = Array.isArray(status) ? status : [status];
      return (
        <>
          {statusArray.map((stat) => {
            let color = stat.length > 5 ? "geekblue" : "green";
            if (stat === "inactive") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={stat}>
                {stat === "active" ? t("Active") : t("Inactive")}
              </Tag>
            );
          })}
        </>
      );
    },
  },
  {
    title: t("Actions"),
    key: "actions",
    align: "center",
    render: (_, record) => (
      <div className={styles["actions-container"]}>
        <Button
          onClick={() => navigate("/edit", { state: { employee: record } })}
          type="primary"
          icon={<EditOutlined />}
          className={styles["edit-button"]}
        >
          {t("Edit")}
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
          type="danger"
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
  const positionsRef = ref(db, "positions");
  const projectsRef = ref(db, "projects");

  const [employeesSnapshot, positionsSnapshot, projectsSnapshot] =
    await Promise.all([get(employeesRef), get(positionsRef), get(projectsRef)]);

  const employees = employeesSnapshot.exists() ? employeesSnapshot.val() : {};
  const positions = positionsSnapshot.exists() ? positionsSnapshot.val() : {};
  const projects = projectsSnapshot.exists() ? projectsSnapshot.val() : {};

  const employeesArray = Object.entries(employees)
    .filter(([key, value]) => !value.deleteStatus) // Filter out deleted employees
    .map(([key, value]) => ({
      key,
      ...value,
    }));

  return { employees: employeesArray, positions, projects };
};

const EmployeeList = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState({});
  const [projects, setProjects] = useState({});
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { employees, positions, projects } = await fetchData();
      setEmployees(employees);
      setPositions(positions);
      setProjects(projects);
    };

    fetchDataAndSetState();
  }, []);

  const handleDeleteAndRefresh = async (employee) => {
    if (employee.status === "active") {
      message.error("Cannot delete an active employee");
      return;
    }

    try {
      const db = getDatabase();
      const employeeRef = ref(db, `employees/${employee.key}`);
      await update(employeeRef, { deleteStatus: true });
      const { employees } = await fetchData();
      setEmployees(employees);
      message.success("Employee status updated to deleted successfully");
    } catch (error) {
      console.error("Error updating employee status:", error);
      message.error("Failed to update employee status");
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Position", key: "positionName", width: 15 },
      { header: "Description", key: "description", width: 50 },
      { header: "CV File", key: "cv_file", width: 50 },
    ];

    employees.forEach((employee) => {
      worksheet.addRow({
        id: employee.key,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        status: employee.status,
        positionName: employee.positionName,
        description: employee.cv_list[0]?.cv_experience[0]?.description || "",
        cv_file: employee.cv_file,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "employee-list.xlsx");
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles["employee-list"]}>
      <Space className={styles["actions-container"]}>
        <Input
          placeholder={t("Search by Name")}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles["search-input"]}
        />
        <Button
          type="primary"
          onClick={() => navigate("/create")}
          className={styles["add-button"]}
        >
          {t("Add Employee")}
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
          className={styles["export-button"]}
        >
          {t("Export to Excel")}
        </Button>
        <Button
          type="default"
          onClick={() => navigate("/EmployeeBin")}
          className={styles["view-bin-button"]}
        >
          {t("View Bin")}
        </Button>
      </Space>
      <Table
        columns={columns(null, handleDeleteAndRefresh, navigate, positions, projects, t)}
        dataSource={filteredEmployees}
        rowKey="key"
        pagination={{ pageSize: 6 }}
        className={styles["employee-table"]}
      />
    </div>
  );
};

export default EmployeeList;
