import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import {
  Card,
  Descriptions,
  Spin,
  message,
  Button,
  Tag,
  Modal,
  Form,
  Select,
} from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";

const { Option } = Select;

const DetailProject = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isUnassignModalVisible, setIsUnassignModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProject = async () => {
      const db = getDatabase();
      const projectRef = ref(db, `projects/${id}`);
      const snapshot = await get(projectRef);
      if (snapshot.exists()) {
        const projectData = snapshot.val();
        setProject(projectData);
        fetchEmployees(projectData.employees || []);
      } else {
        message.error(t("Project not found"));
      }
      setLoading(false);
    };

    const fetchEmployees = async (employeeIds) => {
      const db = getDatabase();
      const employeesRef = ref(db, "employees");
      const snapshot = await get(employeesRef);
      if (snapshot.exists()) {
        const allEmployees = snapshot.val();
        const assignedEmployees = employeeIds.map((empId) => ({
          id: empId,
          ...allEmployees[empId],
        }));
        setEmployees(assignedEmployees);
      }
    };

    fetchProject();
  }, [id, t]);

  const handleAssign = async (values) => {
    const db = getDatabase();
    const projectRef = ref(db, `projects/${id}`);
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
    setIsAssignModalVisible(false);
    form.resetFields();
    setProject(updatedProject); // Update project state
    fetchEmployees(updatedProject.employees); // Fetch updated employees
  };

  const handleUnassign = async (values) => {
    const db = getDatabase();
    const projectRef = ref(db, `projects/${id}`);
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
    setIsUnassignModalVisible(false);
    form.resetFields();
    setProject(updatedProject); // Update project state
    fetchEmployees(updatedProject.employees); // Fetch updated employees
  };

  if (loading) {
    return <Spin tip={t("Loading...")} />;
  }

  const renderTags = (items) => {
    return items.map((item, index) => (
      <Tag key={index} color="blue" style={{ marginBottom: "5px" }}>
        {item}
      </Tag>
    ));
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Not Started":
        return "blue";
      case "Ongoing":
        return "green";
      case "Completed":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <Card title={t("Project Details")} style={{ margin: 20 }}>
      {project ? (
        <>
          <Descriptions bordered column={1}>
            <Descriptions.Item label={t("Name")} style={{ width: 50 }}>
              {project.name}
            </Descriptions.Item>
            <Descriptions.Item label={t("Description")}>
              {project.description}
            </Descriptions.Item>
            <Descriptions.Item label={t("Technology")}>
              {renderTags(project.technology)}
            </Descriptions.Item>
            <Descriptions.Item label={t("Programming Language")}>
              {renderTags(project.programmingLanguage)}
            </Descriptions.Item>
            <Descriptions.Item label={t("Start Date")}>
              {moment(project.startDate).format("YYYY-MM-DD")}
            </Descriptions.Item>
            <Descriptions.Item label={t("End Date")}>
              {moment(project.endDate).format("YYYY-MM-DD")}
            </Descriptions.Item>
            <Descriptions.Item label={t("Status")}>
              <Tag color={getStatusTagColor(project.status)}>
                {t(project.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("Assigned Employees")}>
              {employees.length > 0
                ? employees.map((employee) => (
                    <Tag key={employee.id} color="green">
                      {employee.name}
                    </Tag>
                  ))
                : t("No employees assigned")}
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="primary"
            onClick={() => setIsAssignModalVisible(true)}
            style={{ marginTop: 20 }}
          >
            {t("Assign Employee")}
          </Button>
          <Button
            type="danger"
            onClick={() => setIsUnassignModalVisible(true)}
            style={{ marginTop: 20, marginLeft: 10 }}
            disabled={employees.length === 0}
          >
            {t("Unassign Employee")}
          </Button>
          <Button
            type="default"
            onClick={() => navigate("/projects")}
            style={{ marginTop: 20, marginLeft: 10 }}
          >
            {t("Back to Project List")}
          </Button>
          <Modal
            title={t("Assign Employee to Project")}
            visible={isAssignModalVisible}
            onCancel={() => setIsAssignModalVisible(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleAssign} layout="vertical">
              <Form.Item
                name="employee"
                label={t("Employee")}
                rules={[
                  { required: true, message: t("Please select an employee!") },
                ]}
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
          </Modal>
          <Modal
            title={t("Unassign Employee from Project")}
            visible={isUnassignModalVisible}
            onCancel={() => setIsUnassignModalVisible(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleUnassign} layout="vertical">
              <Form.Item
                name="employee"
                label={t("Employee")}
                rules={[
                  { required: true, message: t("Please select an employee!") },
                ]}
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
                  {t("Unassign")}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : (
        <p>{t("Project not found")}</p>
      )}
    </Card>
  );
};

export default DetailProject;
