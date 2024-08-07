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
  DatePicker,
  Checkbox,
} from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";
import emailjs from "emailjs-com";
import axios from "axios"; // Add this if you decide to use an alternative email service like SendGrid

const { Option } = Select;

const DetailProject = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [noEndDate, setNoEndDate] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const db = getDatabase();
      const projectRef = ref(db, `projects/${id}`);
      const snapshot = await get(projectRef);
      if (snapshot.exists()) {
        const projectData = snapshot.val();
        setProject(projectData);
        setNoEndDate(!projectData.endDate);
        fetchEmployees(projectData.assignedEmployees || []);
        form.setFieldsValue({
          ...projectData,
          startDate: moment(projectData.startDate),
          endDate: projectData.endDate ? moment(projectData.endDate) : null,
        });
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
          name: allEmployees[empId]?.name || "Unknown",
        }));
        setEmployees(assignedEmployees);
        setAllEmployees(
          Object.keys(allEmployees).map((key) => ({
            id: key,
            name: allEmployees[key].name,
          }))
        );
      }
    };

    fetchProject();
  }, [id, t, form]);

  const updateEmployeeStatus = async (employeeId) => {
    const db = getDatabase();
    const employeeRef = ref(db, `employees/${employeeId}`);
    const employeeSnapshot = await get(employeeRef);
    if (!employeeSnapshot.exists()) return;

    const employeeData = employeeSnapshot.val();
    const employeeProjects = employeeData.projects || [];

    const projectStatuses = await Promise.all(
      employeeProjects.map(async (projId) => {
        const projectRef = ref(db, `projects/${projId}`);
        const projectSnapshot = await get(projectRef);
        return projectSnapshot.exists() ? projectSnapshot.val().status : null;
      })
    );

    let newStatus = "Available";
    if (
      projectStatuses.some(
        (status) => status === "Ongoing" || status === "Not Started"
      )
    ) {
      newStatus = "Involved";
    } else if (projectStatuses.every((status) => status === "Completed")) {
      newStatus = "Inactive";
    }

    await update(employeeRef, { status: newStatus });
  };

  const sendEmail = async (emails, projectName, actions) => {
    const emailPromises = emails.map((email) =>
      emailjs.send(
        "service_npsa81b",
        "template_j26jobr",
        { email, projectName, actions },
        "Tj4lqdQXNHyDVUreX"
      )
    );

    try {
      await Promise.all(emailPromises);
      console.log("Emails sent successfully");
    } catch (error) {
      console.error("Error sending emails", error);
      if (error.status === 426) {
        // Handle rate limit error
        message.error("Rate limit reached. Please try again later.");
      } else {
        message.error("Failed to send emails.");
      }
    }
  };

  const handleAssign = async (values) => {
    const db = getDatabase();
    const projectRef = ref(db, `projects/${id}`);
    const projectSnapshot = await get(projectRef);
    const projectData = projectSnapshot.val();

    const employeeList = projectData.assignedEmployees || [];

    const newEmployees = values.employees.filter(
      (employee) => !employeeList.includes(employee)
    );

    if (newEmployees.length === 0) {
      message.error(
        t("Selected employees are already assigned to this project!")
      );
      setIsAssignModalOpen(false);
      form.resetFields();
      return;
    }

    const updatedProject = {
      ...projectData,
      assignedEmployees: [...new Set([...employeeList, ...newEmployees])],
    };

    await update(projectRef, updatedProject);

    const updatedEmails = [];
    for (const employeeId of newEmployees) {
      const employeeRef = ref(db, `employees/${employeeId}`);
      const employeeSnapshot = await get(employeeRef);
      const employeeData = employeeSnapshot.val();
      const employeeProjects = employeeData.projects || [];
      const updatedEmployee = {
        ...employeeData,
        projects: [...new Set([...employeeProjects, id])],
      };
      await update(employeeRef, updatedEmployee);
      await updateEmployeeStatus(employeeId);
      updatedEmails.push(employeeData.email);
    }

    sendEmail(updatedEmails, projectData.name, "added");

    message.success(t("Employees assigned successfully!"));
    setIsAssignModalOpen(false);
    form.resetFields();
    setProject(updatedProject);
    setEmployees((prevEmployees) => [
      ...prevEmployees,
      ...newEmployees.map((id) => allEmployees.find((emp) => emp.id === id)),
    ]);
  };

  const handleUnassign = async (values) => {
    const db = getDatabase();
    const projectRef = ref(db, `projects/${id}`);
    const projectSnapshot = await get(projectRef);
    const projectData = projectSnapshot.val();

    const employeeList = projectData.assignedEmployees || [];
    const updatedEmployees = employeeList.filter(
      (emp) => !values.employees.includes(emp)
    );

    const updatedProject = {
      ...projectData,
      assignedEmployees: updatedEmployees,
    };

    await update(projectRef, updatedProject);

    const updatedEmails = [];
    for (const employeeId of values.employees) {
      const employeeRef = ref(db, `employees/${employeeId}`);
      const employeeSnapshot = await get(employeeRef);
      const employeeData = employeeSnapshot.val();
      const employeeProjects = employeeData.projects || [];
      const updatedEmployeeProjects = employeeProjects.filter(
        (proj) => proj !== id
      );
      const updatedEmployee = {
        ...employeeData,
        projects: updatedEmployeeProjects,
      };
      await update(employeeRef, updatedEmployee);
      await updateEmployeeStatus(employeeId);
      updatedEmails.push(employeeData.email);
    }

    sendEmail(updatedEmails, projectData.name, "fired");

    message.success(t("Employees unassigned successfully!"));
    setIsUnassignModalOpen(false);
    form.resetFields();
    setProject(updatedProject);
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => !values.employees.includes(emp.id))
    );
  };

  if (loading) {
    return (
      <Spin tip={t("Loading...")}>
        <div style={{ height: "100vh", width: "100%" }} />
      </Spin>
    );
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
    <Card title={project ? project.name : t("Project Details")} style={{ margin: 20 }}>
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
              {project.endDate
                ? moment(project.endDate).format("YYYY-MM-DD")
                : t("No end date yet")}
            </Descriptions.Item>
            <Descriptions.Item label={t("Status")}>
              <Tag color={getStatusTagColor(project.status)}>
                {t(project.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t("Assigned Employees")}>
              {employees.length > 0
                ? employees.map((employee) => (
                    <Tag key={employee.id} color="purple">
                      {employee.name}
                    </Tag>
                  ))
                : t("No employees assigned")}
            </Descriptions.Item>
          </Descriptions>
          <Button
            type="primary"
            onClick={() => setIsAssignModalOpen(true)}
            style={{ marginTop: 20 }}
          >
            {t("Assign Employees")}
          </Button>
          <Button
            type="danger"
            onClick={() => setIsUnassignModalOpen(true)}
            style={{
              marginTop: 20,
              marginLeft: 10,
              backgroundColor: employees.length === 0 ? "gray" : "#a83c42",
              color: "white",
              borderColor: employees.length === 0 ? "gray" : "#a83c42",
              cursor: employees.length === 0 ? "not-allowed" : "pointer",
            }}
            disabled={employees.length === 0}
          >
            {t("Unassign Employees")}
          </Button>
          <Button
            type="default"
            onClick={() => navigate("/projects")}
            style={{ marginTop: 20, marginLeft: 10 }}
          >
            {t("Back to Project List")}
          </Button>
          <Modal
            title={t("Assign Employees to Project")}
            open={isAssignModalOpen}
            onCancel={() => setIsAssignModalOpen(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleAssign} layout="vertical">
              <Form.Item
                name="employees"
                label={t("Employees")}
                rules={[
                  { required: true, message: t("Please select employees!") },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder={t("Select employees")}
                  optionFilterProp="children"
                >
                  {allEmployees.map((employee) => (
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
            title={t("Unassign Employees from Project")}
            open={isUnassignModalOpen}
            onCancel={() => setIsUnassignModalOpen(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleUnassign} layout="vertical">
              <Form.Item
                name="employees"
                label={t("Employees")}
                rules={[
                  { required: true, message: t("Please select employees!") },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder={t("Select employees")}
                  optionFilterProp="children"
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
          </Modal>
        </>
      ) : (
        <p>{t("Project not found")}</p>
      )}
    </Card>
  );
};

export default DetailProject;
