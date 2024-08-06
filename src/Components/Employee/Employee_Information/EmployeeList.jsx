import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Tag,
  Button,
  Input,
  Avatar,
  message,
  Select,
  Tooltip,
  Modal
} from "antd";
import {
  UserAddOutlined,
  TeamOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "../../../styles/layouts/EmployeeList.module.scss";
import "../../../styles/layouts/tablestyles.css"     

const { Option } = Select;

const defaultAvatarUrl =
  "https://firebasestorage.googleapis.com/v0/b/ojt-final-project.appspot.com/o/profilePictures%2FdefaultAvatars.jpg?alt=media&token=32a0e3f9-039b-4041-92d0-c248f78cedd9"; // Replace with your actual default avatar URL

const columns = (
  handleEdit,
  handleDelete,
  navigate,
  positions,
  projects,
  t
) => [
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${t("Email")}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              {t("Search")}
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              {t("Reset")}
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: t("Position"),
      dataIndex: "positionName",
      key: "positionName",
      filters: Object.values(positions).map((position) => ({
        text: position.name,
        value: position.name,
      })),
      onFilter: (value, record) => record.positionName === value,
    },
    {
      title: t("Status"),
      key: "status",
      dataIndex: "status",
      filters: [
        { text: t("Involved"), value: "Involved" },
        { text: t("Available"), value: "Available" },
        { text: t("Inactive"), value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, { status }) => {
        const statusArray = Array.isArray(status) ? status : [status];
        return (
          <>
            {statusArray.map((stat) => {
              let color =
                stat === "Inactive"
                  ? "#f50" // Bright red for Inactive
                  : stat === "Available"
                    ? "#87d068" // Light green for Available
                    : "#2db7f5"; // Bright blue for Involved
              return (
                <Tag color={color} key={stat}>
                  {t(stat)}
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
          <Tooltip
            title={
              record.status !== "Inactive"
                ? t("Cannot delete this user while not in inactive state.")
                : ""
            }
          >
            <Button
              type="danger"
              onClick={() => handleDelete(record)}
              icon={<DeleteOutlined />}
              className={styles["delete-button"]}
              disabled={record.status !== "Inactive"}
            >
              {t("Delete")}
            </Button>
          </Tooltip>
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
    .map(([key, value]) => {
      const assignedProjects = Object.entries(projects)
        .filter(([projKey, projValue]) =>
          projValue.assignedEmployees?.includes(key)
        )
        .map(([projKey, projValue]) => projValue);

      let newStatus = "Available"; // Default status

      if (
        assignedProjects.some((project) =>
          ["Ongoing", "Not Started"].includes(project.status)
        )
      ) {
        newStatus = "Involved";
      } else if (
        assignedProjects.some((project) => project.status === "Pending")
      ) {
        newStatus = "Available";
      } else if (
        assignedProjects.every((project) => project.status === "Completed")
      ) {
        newStatus = "Inactive";
      }

      // Update the employee status in the database
      const employeeRef = ref(db, `employees/${key}`);
      update(employeeRef, { status: newStatus });

      return {
        key,
        ...value,
        status: newStatus,
      };
    });

  // Sort employees by status: Involved, Available, Inactive
  employeesArray.sort((a, b) => {
    const order = ["Involved", "Available", "Inactive"];
    return order.indexOf(a.status) - order.indexOf(b.status);
  });

  return { employees: employeesArray, positions, projects };
};

const EmployeeList = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState({});
  const [projects, setProjects] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const { employees, positions, projects } = await fetchData();
      setEmployees(employees);
      setPositions(positions);
      setProjects(projects);
      setFilteredEmployees(employees);
    };

    fetchDataAndSetState();
  }, []);

  const handleDelete = async (employee) => {
    if (employee.status !== "Inactive") {
      message.error("Only Inactive employees can be deleted");
      return;
    }
    Modal.confirm({
      title: t("Confirm Delete"),
      content: t("Are you sure you want to delete this employee?"),
      onOk: async () => {
        try {
          const db = getDatabase();
          const employeeRef = ref(db, `employees/${employee.key}`);
          await update(employeeRef, { deleteStatus: true });
          const { employees } = await fetchData();
          setEmployees(employees);
          applyFilters(searchText, selectedPosition, employees);
          message.success(t("Employee status updated to deleted successfully"));
        } catch (error) {
          console.error(t("Error updating employee status:"), error);
          message.error(t("Failed to update employee status"));
        }
      }
    });


    /*  try {
        const db = getDatabase();
        const employeeRef = ref(db, `employees/${employee.key}`);
        await update(employeeRef, { deleteStatus: true });
        const { employees } = await fetchData();
        setEmployees(employees);
        applyFilters(searchText, selectedPosition, employees);
        message.success("Employee status updated to deleted successfully");
      } catch (error) {
        console.error("Error updating employee status:", error);
        message.error("Failed to update employee status");
      } */
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
      { header: t("Position"), key: "positionName", width: 15 },
      { header: t("Description"), key: "description", width: 50 },
      { header: t("CV File"), key: "cv_file", width: 50 },
    ];

    filteredEmployees.forEach((employee) => {
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

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    applyFilters(value, selectedPosition, employees);
  };

  const handlePositionChange = (value) => {
    setSelectedPosition(value);
    applyFilters(searchText, value, employees);
  };

  const applyFilters = (searchText, selectedPosition, employees) => {
    const filteredData = employees.filter((employee) => {
      const matchesEmail = employee.email.toLowerCase().includes(searchText);
      const matchesPosition = selectedPosition
        ? employee.positionName === selectedPosition
        : true;
      return matchesEmail && matchesPosition;
    });
    setFilteredEmployees(filteredData);
  };

  const handleJoinProject = async (employeeId, projectId) => {
    const db = getDatabase();
    const employeeRef = ref(db, `employees/${employeeId}`);
    const projectRef = ref(db, `projects/${projectId}`);

    const [employeeSnapshot, projectSnapshot] = await Promise.all([
      get(employeeRef),
      get(projectRef),
    ]);

    if (employeeSnapshot.exists() && projectSnapshot.exists()) {
      const employeeData = employeeSnapshot.val();
      const projectData = projectSnapshot.val();

      // Update employee's project list
      const updatedProjects = [...(employeeData.projects || []), projectId];
      await update(employeeRef, { projects: updatedProjects });

      // Update project's assigned employee list
      const updatedAssignedEmployees = [
        ...(projectData.assignedEmployees || []),
        employeeId,
      ];
      await update(projectRef, { assignedEmployees: updatedAssignedEmployees });

      // Re-fetch the data to update statuses
      const { employees } = await fetchData();
      setEmployees(employees);
      applyFilters(searchText, selectedPosition, employees);
      message.success("Employee assigned to project successfully");
    } else {
      message.error("Failed to assign employee to project");
    }
  };

  const handleRemoveProject = async (employeeId, projectId) => {
    const db = getDatabase();
    const employeeRef = ref(db, `employees/${employeeId}`);
    const projectRef = ref(db, `projects/${projectId}`);

    const [employeeSnapshot, projectSnapshot] = await Promise.all([
      get(employeeRef),
      get(projectRef),
    ]);

    if (employeeSnapshot.exists() && projectSnapshot.exists()) {
      const employeeData = employeeSnapshot.val();
      const projectData = projectSnapshot.val();

      // Update employee's project list
      const updatedProjects = (employeeData.projects || []).filter(
        (projId) => projId !== projectId
      );
      await update(employeeRef, { projects: updatedProjects });

      // Update project's assigned employee list
      const updatedAssignedEmployees = (
        projectData.assignedEmployees || []
      ).filter((empId) => empId !== employeeId);
      await update(projectRef, { assignedEmployees: updatedAssignedEmployees });

      // Re-fetch the data to update statuses
      const { employees } = await fetchData();
      setEmployees(employees);
      applyFilters(searchText, selectedPosition, employees);
      message.success("Employee removed from project successfully");
    } else {
      message.error("Failed to remove employee from project");
    }
  };

  return (
    <div className={styles["employee-list"]}>
      <Space className={styles["actions-container"]}>
        <Input
          placeholder={t("Export to Excel filter by Email")}
          onChange={handleSearch}
          className={styles["search-input"]}
        />
        <Select
          placeholder={t("Export to Excel filter by Position")}
          onChange={handlePositionChange}
          className={styles["position-select"]}
          allowClear
        >
          {Object.values(positions).map((position) => (
            <Option key={position.name} value={position.name}>
              {position.name}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<UserAddOutlined></UserAddOutlined>}
          onClick={() => navigate("/create")}
          className={styles["add-button"]}
        >
          {t("Add Employee")}
        </Button>
        <Button
          type="primary"
          icon={<ExportOutlined />}
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

      <div className="title">List of Employees</div>
      
      <Table
        columns={columns(
          null,
          handleDelete,
          navigate,
          positions,
          projects,
          t
        )}
        dataSource={filteredEmployees}
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
    </div>
  );
};

export default EmployeeList;
