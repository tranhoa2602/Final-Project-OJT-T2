import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";
import { getDatabase, ref, get } from "firebase/database";
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

const columns = (
  handleEdit,
  handleDelete,
  navigate,
  positions,
  projects,
  t
) => [
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
    dataIndex: "positionId",
    key: "positionId",
    render: (positionId) => positions[positionId]?.name || "N/A",
  },
  {
    title: t("Projects"),
    dataIndex: "projectIds",
    key: "projectIds",
    render: (projectIds) =>
      projectIds
        ? projectIds.map((id) => projects[id]?.name || "N/A").join(", ")
        : "N/A",
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
                {status === "active" ? t("Active") : t("Inactive")}
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
          onClick={() => handleDelete(record.key)}
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

  const employeesArray = Object.entries(employees).map(([key, value]) => ({
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
  const { handleEdit, handleDelete } = useEmployees();

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { employees, positions, projects } = await fetchData();
      setEmployees(employees);
      setPositions(positions);
      setProjects(projects);
    };

    fetchDataAndSetState();
  }, []);

  const handleDeleteAndRefresh = async (key) => {
    await handleDelete(key);
    const { employees } = await fetchData();
    setEmployees(employees);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      { header: t("ID"), key: "id", width: 10 },
      { header: t("Name"), key: "name", width: 30 },
      { header: t("Email"), key: "email", width: 30 },
      { header: t("Phone"), key: "phone", width: 15 },
      { header: t("Status"), key: "status", width: 15 },
      { header: t("Position"), key: "positionId", width: 15 },
      { header: t("Projects"), key: "projectIds", width: 20 },
      { header: t("Skills"), key: "skills", width: 30 },
      { header: t("Contact"), key: "contact", width: 30 },
      { header: t("CV Skill"), key: "cv_skill", width: 30 },
      { header: t("Work Position"), key: "work_position", width: 30 },
      { header: t("Time Work"), key: "time_work", width: 30 },
      { header: t("Description"), key: "description", width: 50 },
      { header: t("CV File"), key: "cv_file", width: 50 },
    ];

    employees.forEach((employee) => {
      worksheet.addRow({
        id: employee.key,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        status: employee.status,
        positionId: positions[employee.positionId]?.name || employee.positionId,
        projectIds: (employee.projectIds || [])
          .map((id) => projects[id]?.name || id)
          .join(", "),
        skills: employee.skills,
        contact: employee.contact,
        cv_skill: employee.cv_list[0]?.cv_skill || "",
        work_position:
          employee.cv_list[0]?.cv_experience[0]?.work_position || "",
        time_work: employee.cv_list[0]?.cv_experience[0]?.time_work || "",
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
      </Space>
      <Table
        columns={columns(
          null,
          handleDeleteAndRefresh,
          navigate,
          positions,
          projects,
          t
        )}
        dataSource={filteredEmployees}
        rowKey="key"
        pagination={{ pageSize: 6 }}
        className={styles["employee-table"]}
      />
    </div>
  );
};

export default EmployeeList;
