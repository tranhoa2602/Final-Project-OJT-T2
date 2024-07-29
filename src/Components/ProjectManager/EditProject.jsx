import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import { getDatabase, ref, update, get } from "firebase/database";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Option } = Select;

const EditProject = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            const db = getDatabase();
            const projectRef = ref(db, `projects/${id}`);
            const snapshot = await get(projectRef);
            if (snapshot.exists()) {
                setProject(snapshot.val());
                form.setFieldsValue({
                    ...snapshot.val(),
                    startDate: moment(snapshot.val().startDate),
                    endDate: moment(snapshot.val().endDate),
                });
            } else {
                message.error(t("Project not found"));
                navigate("/projects");
            }
        };

        fetchProject();
    }, [id, form, navigate, t]);

    const onFinish = async (values) => {
        const db = getDatabase();
        const projectRef = ref(db, `projects/${id}`);
        const updatedProject = {
            ...values,
            startDate: values.startDate.format("YYYY-MM-DD"),
            endDate: values.endDate.format("YYYY-MM-DD"),
        };

        try {
            await update(projectRef, updatedProject);
            message.success(t("Project updated successfully"));
            navigate("/projects");
        } catch (error) {
            message.error(t("Failed to update project"));
        }
    };

    return (
        <div>
            <h2>{t("Edit Project")}</h2>
            {project && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
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
                        rules={[{ required: true, message: t("Please input the description!") }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="technology"
                        label={t("Technology")}
                        rules={[{ required: true, message: t("Please select the technology!") }]}
                    >
                        <Select>
                            <Option value="React">React</Option>
                            <Option value="Angular">Angular</Option>
                            <Option value="Vue">Vue</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label={t("Start Date")}
                        rules={[{ required: true, message: t("Please select the start date!") }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label={t("End Date")}
                        rules={[{ required: true, message: t("Please select the end date!") }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {t("Update Project")}
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default EditProject;
