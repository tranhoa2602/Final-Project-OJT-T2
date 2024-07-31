import React, { useState, useEffect } from "react";
import { Table, Button, Tag, message, Input, Space } from "antd";
import { getDatabase, ref, get, remove } from "firebase/database";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CreateProject from "./CreateProject";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ListProject = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const db = getDatabase();
    const projectsRef = ref(db, "projects");
    const snapshot = await get(projectsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const formattedData = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
        startDate: new Date(data[key].startDate),
        endDate: new Date(data[key].endDate),
      }));
      setProjects(formattedData);
      setFilteredProjects(sortProjects(formattedData));
    }
  };

  const handleDelete = async (id) => {
    const project = projects.find((project) => project.id === id);
    if (
      project &&
      project.startDate <= new Date() &&
      project.endDate >= new Date()
    ) {
      message.error(t("Cannot delete an ongoing project!"));
      return;
    }

    const db = getDatabase();
    await remove(ref(db, `projects/${id}`));
    message.success(t("Project deleted successfully!"));
    fetchProjects();
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
          <Link to={`/projects/details/${record.id}`}>
            <Button icon={<InfoCircleOutlined />}>{t("Detail")}</Button>
          </Link>
          <Link to={`/projects/edit/${record.id}`}>
            <Button icon={<EditOutlined />} style={{ marginLeft: 8 }}>
              {t("Edit")}
            </Button>
          </Link>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            {t("Delete")}
          </Button>
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
      Name: project.name,
      Description: project.description,
      Technology: project.technology.join(", "),
      ProgrammingLanguage: project.programmingLanguage.join(", "),
      StartDate: project.startDate.toLocaleDateString(),
      EndDate: project.endDate.toLocaleDateString(),
      Status: project.status,
      ProjectManager: project.projectManager,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ProjectRoster.xlsx");
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

        <Button type="primary" onClick={showModal}>
          {t("Create new project")}
        </Button>
        <Button type="primary" onClick={exportToExcel}>
          {t("Export to Excel")}
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey="id"
        pagination={{ pageSize: 6 }}
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
