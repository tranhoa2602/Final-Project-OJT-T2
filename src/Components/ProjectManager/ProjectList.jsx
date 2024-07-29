import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Tag, Input } from "antd";
import { getDatabase, ref, get, remove } from "firebase/database";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";

const ListProject = () => {
    const { t } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const db = getDatabase();
            const projectsRef = ref(db, "projects");
            const snapshot = await get(projectsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setProjects(formattedData);
            } else {
                setProjects([]);
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        const db = getDatabase();
        await remove(ref(db, `projects/${id}`));
        message.success(t("Project deleted successfully!"));
        setProjects(projects.filter(project => project.id !== id));
        setDeleteModalVisible(false);
        setProjectToDelete(null);
    };

    const columns = [
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Search ${t("Name")}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Button
                        type="primary"
                        onClick={confirm}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        {t("Search")}
                    </Button>
                    <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                        {t("Reset")}
                    </Button>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
            onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase())
        },
        {
            title: t("Description"),
            dataIndex: "description",
            key: "description",
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
            filters: [
                { text: t("Not Started"), value: "Not Started" },
                { text: t("Ongoing"), value: "Ongoing" },
                { text: t("Completed"), value: "Completed" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={status === "Ongoing" ? "blue" : status === "Completed" ? "green" : "red"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: t("Actions"),
            key: "actions",
            render: (text, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingProject(record);
                            setEditModalVisible(true);
                        }}
                        style={{ marginRight: 8 }}
                    >
                        {t("Edit")}
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setProjectToDelete(record);
                            setDeleteModalVisible(true);
                        }}
                        type="danger"
                    >
                        {t("Delete")}
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                {t("Add Project")}
            </Button>
            <Table
                columns={columns}
                dataSource={projects}
                rowKey="id"
                pagination={{ pageSize: 6 }}
            />
            <CreateProject
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onSave={() => {
                    setCreateModalVisible(false);
                    window.location.reload();
                }}
            />
            <EditProject
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                project={editingProject}
                onSave={() => {
                    setEditModalVisible(false);
                    window.location.reload();
                }}
            />
            <Modal
                title={t("Confirm Delete")}
                visible={deleteModalVisible}
                onOk={() => handleDelete(projectToDelete.id)}
                onCancel={() => setDeleteModalVisible(false)}
            >
                {t("Are you sure you want to delete this project?")}
            </Modal>
        </div>
    );
};

export default ListProject;
