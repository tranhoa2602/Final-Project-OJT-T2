import React from "react";
import { Space, Table, Tag, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const columns = (handleEdit, handleDelete, navigate) => [
  {
    title: "ID",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <a onClick={() => navigate('/details', { state: { employee: record } })}>
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
    title: "Position ID",
    dataIndex: "positionId",
    key: "positionId",
  },
  {
    title: "Project IDs",
    dataIndex: "projectIds",
    key: "projectIds",
    render: (projectIds) => projectIds.join(", "),
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status) => {
      let color = status.length > 5 ? "geekblue" : "green";
      if (status === "inactive") {
        color = "volcano";
      }
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a onClick={() => navigate('/edit', { state: { employee: record } })}>Edit</a>
        <a onClick={() => navigate('/details', { state: { employee: record } })}>Details</a>
        <a onClick={() => handleDelete(record.key)}>Delete</a>
      </Space>
    ),
  },
];

const EmployeeList = () => {
  const { employees, handleEdit, handleDelete } = useEmployees();
  const navigate = useNavigate();

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    // Add header row
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Password", key: "password", width: 20 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Is Admin", key: "isAdmin", width: 10 },
      { header: "Status", key: "status", width: 15 },
      { header: "Position ID", key: "positionId", width: 15 },
      { header: "Project IDs", key: "projectIds", width: 20 },
      { header: "Skills", key: "skills", width: 30 },
      { header: "Contact", key: "contact", width: 30 },
      { header: "CV List", key: "cv_list", width: 50 },
    ];

    // Add data rows
    employees.forEach((employee) => {
      worksheet.addRow({
        id: employee.key,
        name: employee.name,
        email: employee.email,
        password: employee.password,
        phone: employee.phone,
        isAdmin: employee.isAdmin,
        status: employee.status,
        positionId: employee.positionId,
        projectIds: (employee.projectIds || []).join(", "),
        skills: employee.skills,
        contact: employee.contact,
        cv_list: (employee.cv_list || [])
          .map(
            (cv) =>
              `Skill: ${cv.cv_skill}, Experience: ${cv.cv_experience
                .map(
                  (exp) =>
                    `Position: ${exp.work_position}, Time: ${exp.time_work}, Description: ${exp.description}`
                )
                .join("; ")}`
          )
          .join("\n"),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "employee-list.xlsx");
  };

  return (
    <div>
      <Table columns={columns(handleEdit, handleDelete, navigate)} dataSource={employees} id="employee-table" />
      <Button
        type="primary"
        htmlType="button"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/create")}
      >
        Add Employee
      </Button>
      <Button
        type="primary"
        htmlType="button"
        onClick={exportToExcel}
        style={{ marginTop: 16, marginLeft: 16 }}
      >
        Export to Excel
      </Button>
    </div>
  );
};

export default EmployeeList;
