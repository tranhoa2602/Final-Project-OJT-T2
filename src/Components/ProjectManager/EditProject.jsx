import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, message, Space } from "antd";
import { getDatabase, ref, update, get } from "firebase/database";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EditProject = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [project, setProject] = useState(null);
    const [technologies, setTechnologies] = useState([]);
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            const db = getDatabase();
            const projectRef = ref(db, `projects/${id}`);
            const snapshot = await get(projectRef);
            if (snapshot.exists()) {
                const projectData = snapshot.val();
                setProject(projectData);
                form.setFieldsValue({
                    ...projectData,
                    dateRange: [
                        dayjs(projectData.startDate),
                        dayjs(projectData.endDate),
                    ],
                });
            } else {
                message.error(t("Project not found"));
                navigate("/projects");
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
                    .filter((tech) => tech.techstatus === "Active"); // Filter for active technologies
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
                    .filter((lang) => lang.programingstatus === "Active"); // Filter for active languages
                setLanguages(formattedData);
            }
        };

        fetchProject();
        fetchTechnologies();
        fetchLanguages();
    }, [id, form, navigate, t]);

    const onFinish = async (values) => {
        const db = getDatabase();
        const projectRef = ref(db, `projects/${id}`);
        const [startDate, endDate] = values.dateRange;
        const updatedProject = {
            ...values,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
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

    return (
        <div>
            <h2>{t("Edit Project")}</h2>
            {project && (
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
                            name="dateRange"
                            label={t("Date Range")}
                            rules={[
                                { required: true, message: t("Please select the date range!") },
                            ]}
                        >
                            <RangePicker
                                format="YYYY-MM-DD"
                                getPopupContainer={(trigger) => trigger.parentNode}
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
                                <Option value="Not Started">{t("Not Started")}</Option>
                                <Option value="Ongoing">{t("Ongoing")}</Option>
                                <Option value="Completed">{t("Completed")}</Option>
                                <Option value="Pending">{t("Pending")}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {t("Update Project")}
                                </Button>
                                <Button type="default" onClick={() => navigate("/projects")}>
                                    {t("Back to Project List")}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Space>
                </Form>
            )}
        </div>
    );
};

export default EditProject;
