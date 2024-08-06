import React, { useState, useEffect } from "react";
import { Table, Button, Tag, message, Input, Space } from "antd";
import { getDatabase, ref, update, get } from "firebase/database";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CreateProject from "./CreateProject";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../styles/layouts/tablestyles.css"     

const ListProject = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const db = getDatabase();
    const projectsRef = ref(db, "projects");
    const snapshot = await get(projectsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const formattedData = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key],
          startDate: new Date(data[key].startDate),
          endDate: new Date(data[key].endDate),
        }))
        .filter((project) => project.deletestatus === false); // Only include projects not marked as deleted
      setProjects(formattedData);
      setFilteredProjects(sortProjects(formattedData));
    }
  };

  const handleDelete = async (id) => {
    try {
      const db = getDatabase();
      await update(ref(db, `projects/${id}`), { deletestatus: true });
      message.success(t("Project moved to bin successfully!"));
      fetchProjects(); // Refresh the project list after deletion
    } catch (error) {
      console.error("Error updating delete status:", error);
      message.error(t("Failed to move project to bin!"));
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "Pending":
        return <Tag color="orange">{t("Pending")}</Tag>;
      case "Not Started":
        return <Tag color="blue">{t("Not Started")}</Tag>;
      case "Ongoing":
        return <Tag color="green">{t("Ongoing")}</Tag>;
      case "Completed":
        return <Tag color="red">{t("Completed")}</Tag>;
      default:
        return null;
    }
  };

  const statusOrder = {
    Ongoing: 1,
    Pending: 2,
    "Not Started": 3,
    Completed: 4,
  };

  const sortProjects = (projects) => {
    return projects.sort(
      (a, b) => statusOrder[a.status] - statusOrder[b.status]
    );
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("Project Manager"),
      dataIndex: "projectManager",
      key: "projectManager",
    },
    {
      title: t("Status"),
      key: "status",
      render: (text, record) => getStatusTag(record.status),
      filters: [
        { text: t("Pending"), value: "Pending" },
        { text: t("Not Started"), value: "Not Started" },
        { text: t("Ongoing"), value: "Ongoing" },
        { text: t("Completed"), value: "Completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t("Actions"),
      key: "actions",
      render: (text, record) => (
        <>
          {(user?.position === "Project Manager" || user?.role === "Admin") && (
            <Link to={`/projects/details/${record.id}`}>
              <Button icon={<InfoCircleOutlined />}>{t("Detail")}</Button>
            </Link>
          )}

          {(user?.position === "Project Manager" &&
            user?.name === record.projectManager) ||
            user?.role === "Admin" ? (
            <>
              <Link to={`/projects/edit/${record.id}`}>
                <Button icon={<EditOutlined />} type="primary" style={{ marginLeft: 8 }}>
                  {t("Edit")}
                </Button>
              </Link>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record.id)}
                style={{ marginLeft: 8 }}
                disabled={record.status === "Ongoing" || record.status === "Pending"} // Disable button if status is "Ongoing" or "Pending"
              >
                {t("Delete")}
              </Button>
            </>
          ) : null}
        </>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    navigate("/projects");
  };

  const handleSave = () => {
    setIsModalVisible(false);
    navigate("/projects");
    fetchProjects();
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    filterProjects(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterProjects(searchText, value);
  };

  const filterProjects = (searchText, statusFilter) => {
    let filtered = projects;

    if (searchText) {
      filtered = filtered.filter((project) =>
        project.name.toLowerCase().includes(searchText)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(sortProjects(filtered));
  };

  const exportToExcel = () => {
    const dataToExport = filteredProjects.map((project) => ({
      [t("Name")]: project.name,
      [t("Description")]: project.description,
      [t("Technology")]: project.technology.join(", "),
      [t("Programming Language")]: project.programmingLanguage.join(", "),
      [t("Start Date")]: project.startDate.toLocaleDateString(),
      [t("End Date")]: project.endDate.toLocaleDateString(),
      [t("Status")]: project.status,
      [t("Project Manager")]: project.projectManager,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("Projects"));
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, t("ProjectRoster") + ".xlsx");
  };

  return (
    <div>
      <Space style={{ marginTop: 16 }}>
        <Input
          placeholder={t("Search by Name")}
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200 }}
        />

        {(user?.position === "Project Manager" || user?.role === "Admin") && (
          <Button type="primary" icon={<PlusOutlined></PlusOutlined>} onClick={showModal}>
            {t("Create new project")}
          </Button>
        )}
        {(user?.position === "Project Manager" || user?.role === "Admin") && (
          <Button type="primary" icon={<ExportOutlined></ExportOutlined>} onClick={exportToExcel}>
            {t("Export to Excel")}
          </Button>
        )}
        {(user?.position === "Project Manager" || user?.role === "Admin") && (
          <Button type="default" icon={<DeleteOutlined></DeleteOutlined>} onClick={() => navigate("/ProjectBin")}>
            {t("Project Bin")}
          </Button>
        )}
      </Space>

      <div className="title">List of Projects</div>

      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey="id"
        pagination={{ pageSize: 6 }}
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
      <CreateProject
        visible={isModalVisible}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
};

export default ListProject;
