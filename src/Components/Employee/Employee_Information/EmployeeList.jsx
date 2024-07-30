import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";
import { getDatabase, ref, get } from "firebase/database";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";



const columns = (handleEdit, handleDelete, navigate, positions, projects) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => <a onClick={() => navigate('/details', { state: { employee: record } })}>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Position",
    dataIndex: "positionId",
    key: "positionId",
    render: (positionId) => positions[positionId]?.name || "N/A",
  },
  {
    title: "Projects",
    dataIndex: "projectIds",
    key: "projectIds",
    render: (projectIds) => projectIds.map(id => projects[id]?.name || "N/A").join(', '),
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


const fetchData = async () => {
  const db = getDatabase();
  const employeesRef = ref(db, "employees");
  const positionsRef = ref(db, "positions");
  const projectsRef = ref(db, "projects");

  const [employeesSnapshot, positionsSnapshot, projectsSnapshot] = await Promise.all([
    get(employeesRef),
    get(positionsRef),
    get(projectsRef),
  ]);

  const employees = employeesSnapshot.exists() ? employeesSnapshot.val() : {};
  const positions = positionsSnapshot.exists() ? positionsSnapshot.val() : {};
  const projects = projectsSnapshot.exists() ? projectsSnapshot.val() : {};

  // Process data as needed, e.g., converting to array
  const employeesArray = Object.entries(employees).map(([key, value]) => ({
    key, // This is the unique ID
    ...value,
  }));

  return { employees: employeesArray, positions, projects };
};


const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState({});
  const [projects, setProjects] = useState({});
  const navigate = useNavigate();
  const {handleEdit, handleDelete } = useEmployees();

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
    fetchEmployees();
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
      { header: "Position", key: "positionId", width: 15 },
      { header: "Projects", key: "projectIds", width: 20 },
      { header: "Skills", key: "skills", width: 30 },
      { header: "Contact", key: "contact", width: 30 },
      { header: "CV Skill", key: "cv_skill", width: 30 },
      { header: "Work Position", key: "work_position", width: 30 },
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
        positionId: positions[employee.positionId]?.name || employee.positionId,
        projectIds: (employee.projectIds || []).map(id => projects[id]?.name || id).join(", "),
        skills: employee.skills,
        contact: employee.contact,
        cv_skill: employee.cv_list[0]?.cv_skill || "",
        work_position: employee.cv_list[0]?.cv_experience[0]?.work_position || "",
        time_work: employee.cv_list[0]?.cv_experience[0]?.time_work || "",
        description: employee.cv_list[0]?.cv_experience[0]?.description || "",
        cv_file: employee.cv_file,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "employee-list.xlsx");
  };

  return (
    <div>
      <Table 
         columns={columns(null, handleDelete, navigate, positions, projects)}  
        dataSource={employees} 
        id="employee-table" 
      />
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
