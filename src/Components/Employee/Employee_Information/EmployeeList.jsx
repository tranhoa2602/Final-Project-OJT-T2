import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, Input } from "antd"; // Import Input from Ant Design
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
import styles from "../../../styles/layouts/EmployeeList.module.scss"; // Import the SCSS module

const columns = (handleEdit, handleDelete, navigate, positions, projects) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <a onClick={() => navigate("/details", { state: { employee: record } })}>
        {text}
      </a>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Position",
    dataIndex: "positionName",
    key: "positionName",
  },
  {
    title: "Projects",
    dataIndex: "projectNames",
    key: "projectNames",
    render: (projects) => (projects || []).join(' '),  // Join project names with a space
  },
  {
    title: "Status",
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
                {stat.toUpperCase()}
              </Tag>
            );
          })}
        </>
      );
    },
  },
  {
    title: "Actions",
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
          Edit
        </Button>
        <Button
          type="default"
          onClick={() => navigate("/details", { state: { employee: record } })}
          icon={<InfoCircleOutlined />}
          className={styles["detail-button"]}
        >
          Details
        </Button>
        <Button
          type="danger"
          onClick={() => handleDelete(record.key)}
          icon={<DeleteOutlined />}
          className={styles["delete-button"]}
        >
          Delete
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
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Position", key: "positionName", width: 15 },
      { header: "Projects", key: "projectNames", width: 20 },
      { header: "Skills", key: "skills", width: 30 },
      { header: "Contact", key: "contact", width: 30 },
      { header: "CV Skill", key: "cv_skill", width: 30 },
      { header: "Time Work", key: "time_work", width: 30 },
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
        projectNames: employee.projectNames || [].join(' '),
        skills: employee.skills,
        contact: employee.contact,
        cv_skill: employee.cv_list[0]?.cv_skill || "",
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

  return (
    <div className={styles["employee-list"]}>
      <Space className={styles["actions-container"]}>
        <Input
          placeholder="Search by Name"
          onChange={(e) => setSearchText(e.target.value)}
          className={styles["search-input"]}
        />
        <Button
          type="primary"
          onClick={() => navigate("/create")}
          className={styles["add-button"]}
        >
          Add Employee
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
          className={styles["export-button"]}
        >
          Export to Excel
        </Button>
      </Space>
      <Table
        columns={columns(
          null,
          handleDeleteAndRefresh,
          navigate,
          positions,
          projects
        )}
        dataSource={employees}
        rowKey="key"
        pagination={{ pageSize: 6 }}
        className={styles["employee-table"]}
      />
    </div>
  );
};

export default EmployeeList;
