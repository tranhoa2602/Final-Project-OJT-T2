import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    message,
    Space,
} from "antd";
import { getDatabase, ref, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import moment from "moment"; // Ensure moment is imported correctly

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CreateProject = ({ visible, onCancel, onSave }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [technologies, setTechnologies] = useState([]);
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
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

        fetchTechnologies();
        fetchLanguages();
    }, []);

    const handleSave = async (values) => {
        const db = getDatabase();
        const newProjectId = uuidv4();
        const projectRef = ref(db, `projects/${newProjectId}`);
        const [startDate, endDate] = values.dateRange;
        const projectData = {
            ...values,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            status: "Not Started", // Set default status to "Not Started"
            dateRange: null,
        };

        if (moment(startDate).isAfter(endDate)) {
            message.error(t("Start date cannot be after end date."));
            return;
        }

        await set(projectRef, projectData);
        message.success(t("Project added successfully!"));
        onSave();
        form.resetFields();
    };

    return (
        <Modal
            title={t("Create new project")}
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleSave}
                layout="vertical"
                initialValues={{ status: "Not Started" }}
            >
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
                            { required: true, message: t("Please select the technologies!") },
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {t("Create new project")}
                        </Button>
                    </Form.Item>
                </Space>
            </Form>
        </Modal>
    );
};

export default CreateProject;
