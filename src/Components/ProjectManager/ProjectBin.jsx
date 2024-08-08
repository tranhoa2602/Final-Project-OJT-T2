import React, { useState, useEffect } from "react";
import { Table, Button, Tag, message, Space, Skeleton, Modal } from "antd";
import { getDatabase, ref, update, remove, get, set } from "firebase/database";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProjectBin = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true); // Set loading to true before fetching data
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
      const deletedProjects = formattedData.filter(
        (project) => project.deletestatus === true
      );
      setProjects(deletedProjects);
      setFilteredProjects(deletedProjects);
    }
    setLoading(false); // Set loading to false after data is fetched
  };

  const getVietnamTime = () => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    
    const parts = formatter.formatToParts(new Date());
    const day = parts.find(part => part.type === 'day').value;
    const month = parts.find(part => part.type === 'month').value;
    const year = parts.find(part => part.type === 'year').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;
    const second = parts.find(part => part.type === 'second').value;
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const handleRestore = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to restore this project from the bin?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        const db = getDatabase();
  
        try {
          const projectRef = ref(db, `projects/${id}`);
          const projectSnapshot = await get(projectRef);
  
          if (!projectSnapshot.exists()) {
            throw new Error("Project not found.");
          }
  
          const projectData = projectSnapshot.val();
          const projectName = projectData.name;
  
          if (!projectName) {
            throw new Error("Project name is undefined.");
          }
  
          await update(projectRef, { deletestatus: false });
  
          const userKey = JSON.parse(localStorage.getItem('user'))?.key;
          if (!userKey) {
            throw new Error("User key is missing in local storage.");
          }
  
          const userRef = ref(db, `users/${userKey}`);
          const userSnapshot = await get(userRef);
  
          if (!userSnapshot.exists()) {
            throw new Error("User not found.");
          }
  
          const userName = userSnapshot.val().name || 'Unknown';
  
          const formattedTimestamp = getVietnamTime();
          const historyRef = ref(db, `projecthistory/${formattedTimestamp.replace(/[/: ]/g, "_")}`);
  
          await set(historyRef, {
            projectname: projectName,
            user: userName,
            action: "Restored from Bin",
            timestamp: formattedTimestamp,
          });
  
          message.success(t("Project successfully restored!"));
          fetchProjects();
  
        } catch (error) {
          console.error("Error restoring project:", error.message);
          message.error(t(`Failed to restore project: ${error.message}`));
        }
      },
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to permanently delete this project?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        const db = getDatabase();
  
        try {
          const projectRef = ref(db, `projects/${id}`);
          const projectSnapshot = await get(projectRef);
  
          if (!projectSnapshot.exists()) {
            throw new Error("Project not found.");
          }
  
          const projectData = projectSnapshot.val();
          const projectName = projectData.name;
  
          if (!projectName) {
            throw new Error("Project name is undefined.");
          }
  
          const userKey = JSON.parse(localStorage.getItem('user'))?.key;
          if (!userKey) {
            throw new Error("User key is missing in local storage.");
          }
  
          const userRef = ref(db, `users/${userKey}`);
          const userSnapshot = await get(userRef);
  
          if (!userSnapshot.exists()) {
            throw new Error("User not found.");
          }
  
          const userName = userSnapshot.val().name || 'Unknown';
  
          await remove(projectRef);
  
          const formattedTimestamp = getVietnamTime();
          const historyRef = ref(db, `projecthistory/${formattedTimestamp.replace(/[/: ]/g, "_")}`);
  
          await set(historyRef, {
            projectname: projectName,
            user: userName,
            action: "Permanently Deleted",
            timestamp: formattedTimestamp,
          });
  
          message.success(t("Project permanently deleted!"));
          fetchProjects();
  
        } catch (error) {
          console.error("Error deleting project:", error.message);
          message.error(t(`Failed to permanently delete project: ${error.message}`));
        }
      },
    });
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
          <Button danger onClick={() => handleDelete(record.id)}>
            {t("Delete")}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginTop: 16, marginBottom: 16 }}>
        <Link to="/projects">
          <Button type="default">{t("Back to Project List")}</Button>
        </Link>
      </Space>
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
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
      )}
    </div>
  );
};

export default ProjectBin;
