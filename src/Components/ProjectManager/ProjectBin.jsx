import React, { useState, useEffect } from "react";
import { Table, Button, Tag, message, Space } from "antd";
import { getDatabase, ref, update, remove, get } from "firebase/database";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProjectBin = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

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
      const deletedProjects = formattedData.filter(project => project.deletestatus === true);
      setProjects(deletedProjects);
      setFilteredProjects(deletedProjects);
    }
  };

  const handleRestore = async (id) => {
    const db = getDatabase();
    await update(ref(db, `projects/${id}`), { deletestatus: false });
    message.success(t("Project successfully restored!"));
    fetchProjects();
  };
  

  const handleDelete = async (id) => {
    const db = getDatabase();
    await remove(ref(db, `projects/${id}`));
    message.success(t("Project permanently deleted!"));
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
    },
    {
      title: t("Actions"),
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            onClick={() => handleRestore(record.id)}
            style={{ marginRight: 8 }}
          >
            {t("Restore")}
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record.id)}
          >
            {t("Delete")}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginTop: 16 }}>
        <Link to="/projects">
          <Button type="default">
            {t("Back to Project List")}
          </Button>
        </Link>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey="id"
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default ProjectBin;
