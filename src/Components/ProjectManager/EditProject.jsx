import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, message, Space, Spin, Checkbox, Row, Col } from "antd";
import { getDatabase, ref, update, get } from "firebase/database";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Option } = Select;

const EditProject = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [project, setProject] = useState(null);
    const [technologies, setTechnologies] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noEndDate, setNoEndDate] = useState(false);
    const [dateError, setDateError] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const db = getDatabase();
                const projectRef = ref(db, `projects/${id}`);
                const snapshot = await get(projectRef);
                if (snapshot.exists()) {
                    const projectData = snapshot.val();
                    setProject(projectData);
                    setNoEndDate(!projectData.endDate);
                    form.setFieldsValue({
                        ...projectData,
                        dateRange: [
                            projectData.startDate ? dayjs(projectData.startDate) : null,
                            projectData.endDate ? dayjs(projectData.endDate) : null
                        ],
                    });
                } else {
                    message.error(t("Project not found"));
                    navigate("/projects");
                }
            } catch (error) {
                console.error("Failed to fetch project:", error);
                message.error(t("Failed to fetch project"));
                navigate("/projects");
            } finally {
                setLoading(false);
            }
        };

        const fetchTechnologies = async () => {
            const db = getDatabase();
            const techRef = ref(db, "technologies");
            const snapshot = await get(techRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedData = Object.keys(data)
                    .map((key) => ({
                        id: key,
                        ...data[key],
                    }))
                    .filter((tech) => tech.techstatus === "Active");
                setTechnologies(formattedData);
            }
        };

        const fetchLanguages = async () => {
            const db = getDatabase();
            const langRef = ref(db, "programmingLanguages");
            const snapshot = await get(langRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedData = Object.keys(data)
                    .map((key) => ({
                        id: key,
                        ...data[key],
                    }))
                    .filter((lang) => lang.programingstatus === "Active");
                setLanguages(formattedData);
            }
        };

        const fetchProjectManagers = async () => {
            const db = getDatabase();
            const empRef = ref(db, "employees");
            const snapshot = await get(empRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedData = Object.keys(data)
                    .map((key) => ({
                        id: key,
                        ...data[key],
                    }))
                    .filter((emp) => emp.positionName === "Project Manager" && (emp.status === "Involved" || emp.status === "Available"));
                setProjectManagers(formattedData);
            }
        };

        fetchProject();
        fetchTechnologies();
        fetchLanguages();
        fetchProjectManagers();
    }, [id, form, navigate, t]);

    const onFinish = async (values) => {
        const [startDate, endDate] = values.dateRange;

        if (endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
            message.error(t("End date cannot be before start date!"));
            setDateError(true);
            return;
        }

        setDateError(false);

        const db = getDatabase();
        const projectRef = ref(db, `projects/${id}`);
        const updatedProject = {
            ...values,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
            deleteStatus: project?.deletestatus ?? false,
        };

        delete updatedProject.dateRange;

        try {
            await update(projectRef, updatedProject);
            message.success(t("Project updated successfully"));
            navigate("/projects");
        } catch (error) {
            console.error("Failed to update project:", error);
            message.error(t("Failed to update project"));
        }
    };

    const getStatusOptions = () => {
        if (!project) return [];

        const currentStatus = project.status;
        const statusOptions = [
            { value: "Not Started", label: t("Not Started") },
            { value: "Ongoing", label: t("Ongoing") },
            { value: "Completed", label: t("Completed") },
            { value: "Pending", label: t("Pending") },
        ];

        // Filter out options based on current status
        if (currentStatus === "Pending" || currentStatus === "Ongoing") {
            return statusOptions.filter(
                (option) => option.value !== "Not Started"
            );
        } else if (currentStatus === "Completed") {
            return statusOptions.filter(
                (option) => option.value === "Completed"
            );
        }

        return statusOptions;
    };

    return (
        <div>
            <h2>{t("Edit Project")}</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                project && (
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            <Form.Item
                                name="name"
                                label={t("Name")}
                                rules={[{ required: true, message: t("Please input the name!") }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={t("Description")}
                                rules={[
                                    { required: true, message: t("Please input the description!") },
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="technology"
                                label={t("Technology")}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please select the technologies!"),
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder={t("Please select the technologies!")}
                                >
                                    {technologies.map((tech) => (
                                        <Option key={tech.id} value={tech.techname}>
                                            {tech.techname}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="programmingLanguage"
                                label={t("Programming Language")}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please select the programming languages!"),
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder={t("Please select the programming languages!")}
                                >
                                    {languages.map((lang) => (
                                        <Option key={lang.id} value={lang.programingname}>
                                            {lang.programingname}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="projectManager"
                                label={t("Project Manager")}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please select the project manager!"),
                                    },
                                ]}
                            >
                                <Select placeholder={t("Please select the project manager!")}>
                                    {projectManagers.map((manager) => (
                                        <Option key={manager.id} value={manager.name}>
                                            {manager.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="dateRange"
                                label={t("Project Duration")}
                                rules={[{ required: true, message: t("Please select the project duration!") }]}
                            >
                                <DatePicker.RangePicker
                                    format="YYYY-MM-DD"
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    onChange={() => setDateError(false)}  // Reset the date error on change
                                />
                            </Form.Item>
                            <Form.Item
                                name="status"
                                label={t("Status")}
                                rules={[
                                    { required: true, message: t("Please select the project status!") },
                                ]}
                            >
                                <Select placeholder={t("Please select the project status!")}>
                                    {getStatusOptions().map((option) => (
                                        <Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" disabled={dateError}>
                                        {t("Update Project")}
                                    </Button>
                                    <Button type="default" onClick={() => navigate("/projects")}>
                                        {t("Back to Project List")}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Space>
                    </Form>
                )
            )}
        </div>
    );
};

export default EditProject;
