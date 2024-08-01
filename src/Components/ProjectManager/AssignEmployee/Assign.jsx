import React, { useState, useEffect } from "react";
import { Form, Select, Button, message } from "antd";
import { getDatabase, ref, get, update } from "firebase/database";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const AssignEmployee = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const db = getDatabase();
      const projectsRef = ref(db, "projects");
      const snapshot = await get(projectsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProjects(formattedData);
      }
    };

    const fetchEmployees = async () => {
      const db = getDatabase();
      const employeesRef = ref(db, "employees");
      const snapshot = await get(employeesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setEmployees(formattedData);
      }
    };

    fetchProjects();
    fetchEmployees();
  }, []);

  const handleAssign = async (values) => {
    const db = getDatabase();
    const projectRef = ref(db, `projects/${values.project}`);
    const projectSnapshot = await get(projectRef);
    const projectData = projectSnapshot.val();
    const updatedProject = {
      ...projectData,
      employees: projectData.employees
        ? [...projectData.employees, values.employee]
        : [values.employee],
    };

    await update(projectRef, updatedProject);
    message.success(t("Employee assigned successfully!"));
    form.resetFields();
  };

  return (
    <div>
      <h2>{t("Assign Employee to Project")}</h2>
      <Form form={form} onFinish={handleAssign} layout="vertical">
        <Form.Item
          name="project"
          label={t("Project")}
          rules={[{ required: true, message: t("Please select a project!") }]}
        >
          <Select placeholder={t("Select a project")}>
            {projects.map((project) => (
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="employee"
          label={t("Employee")}
          rules={[{ required: true, message: t("Please select an employee!") }]}
        >
          <Select placeholder={t("Select an employee")}>
            {employees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("Assign")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AssignEmployee;
