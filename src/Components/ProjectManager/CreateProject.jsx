import React from "react";
import { Modal, Form, Input, Button, DatePicker, Select, message } from "antd";
import { getDatabase, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;

const CreateProject = ({ visible, onCancel, onSave }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleSave = async (values) => {
        const db = getDatabase();
        const newProjectId = uuidv4();
        const projectRef = ref(db, `projects/${newProjectId}`);
        await set(projectRef, values);
        message.success(t("Project added successfully!"));
        onSave();
        form.resetFields();
    };

    return (
        <Modal
            title={t("Add Project")}
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleSave}
                layout="vertical"
                initialValues={{ status: "Not Started" }}
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
                    name="status"
                    label={t("Status")}
                    rules={[{ required: true, message: t("Please select the status!") }]}
                >
                    <Select>
                        <Option value="Not Started">{t("Not Started")}</Option>
                        <Option value="Ongoing">{t("Ongoing")}</Option>
                        <Option value="Completed">{t("Completed")}</Option>
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
                        {t("Add Project")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateProject;
