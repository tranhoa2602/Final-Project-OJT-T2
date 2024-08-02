import React, { useState, useEffect } from "react";
import { Form, Select, Button, message } from "antd";
import { getDatabase, ref, get, update } from "firebase/database";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const UnassignEmployee = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

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

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchEmployees = async () => {
        const db = getDatabase();
        const projectRef = ref(db, `projects/${selectedProject}`);
        const snapshot = await get(projectRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const employeeIds = data.employees || [];

          const employeesRef = ref(db, "employees");
          const employeesSnapshot = await get(employeesRef);
          if (employeesSnapshot.exists()) {
            const allEmployees = employeesSnapshot.val();
            const assignedEmployees = employeeIds.map((empId) => ({
              id: empId,
              ...allEmployees[empId],
            }));
            setEmployees(assignedEmployees);
          }
        }
      };

      fetchEmployees();
    } else {
      setEmployees([]);
    }
  }, [selectedProject]);

  const handleUnassign = async (values) => {
    const db = getDatabase();
    const projectRef = ref(db, `projects/${values.project}`);
    const projectSnapshot = await get(projectRef);
    const projectData = projectSnapshot.val();
    const updatedEmployees = projectData.employees.filter(
      (emp) => emp !== values.employee
    );
    const updatedProject = {
      ...projectData,
      employees: updatedEmployees,
    };

    await update(projectRef, updatedProject);
    message.success(t("Employee unassigned successfully!"));
    form.resetFields();
  };

  return (
    <div>
      <h2>{t("Unassign Employee from Project")}</h2>
      <Form form={form} onFinish={handleUnassign} layout="vertical">
        <Form.Item
          name="project"
          label={t("Project")}
          rules={[{ required: true, message: t("Please select a project!") }]}
        >
          <Select
            placeholder={t("Select a project")}
            onChange={(value) => setSelectedProject(value)}
          >
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
          <Select
            placeholder={t("Select an employee")}
            disabled={!selectedProject}
          >
            {employees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("Unassign")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UnassignEmployee;
