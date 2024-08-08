import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update, push } from "firebase/database";
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
import emailjs from "emailjs-com";
import BackButton from "../layouts/BackButton";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

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
  const [assignForm] = Form.useForm();
  const [unassignForm] = Form.useForm();
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
        assignForm.setFieldsValue({
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
  }, [id, t, assignForm]);

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
        "service_ix57gso",
        "template_ah5k8be",
        {
          to_name: email.name,
          email_name: email.email,
          from_name: "Your Company Name",
          email: email.email,
          projectName,
          actions,
        },
        "9CB1DrFUxye4x5Y7j"
      )
    );

    try {
      await Promise.all(emailPromises);
      console.log("Emails sent successfully");
    } catch (error) {
      console.error("Error sending emails", error);
      if (error.response && error.response.status === 426) {
        // Handle rate limit error
        message.error("Rate limit reached. Please try again later.");
      } else {
        message.error("Failed to send emails.");
      }
    }
  };

  const logHistory = async (employees, projectName, action) => {
    const db = getDatabase();
    const historyRef = ref(db, `projectassignhistory`);
    const timestamp = new Date().toISOString();

    const historyPromises = employees.map((employee) =>
      push(historyRef, {
        user: "current user", // replace with the actual user information if available
        action,
        employeeName: employee.name,
        projectName,
        timestamp,
      })
    );

    await Promise.all(historyPromises);
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
      assignForm.resetFields();
      return;
    }

    const updatedProject = {
      ...projectData,
      assignedEmployees: [...new Set([...employeeList, ...newEmployees])],
    };

    const updates = {};
    updates[`projects/${id}`] = updatedProject;

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
      updates[`employees/${employeeId}`] = updatedEmployee;
      updatedEmails.push(employeeData);
    }

    await update(ref(db), updates);

    for (const employeeId of newEmployees) {
      await updateEmployeeStatus(employeeId);
    }

    await sendEmail(updatedEmails, projectData.name, "added");
    await logHistory(updatedEmails, projectData.name, "assigned");

    message.success(t("Employees assigned successfully!"));
    setIsAssignModalOpen(false);
    assignForm.resetFields();
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

    const updates = {};
    updates[`projects/${id}`] = updatedProject;

    const updatedEmails = [];
    for (const employeeId of values.employees) {
      const employeeRef = ref(db, `employees/${employeeId}`);
      const employeeSnapshot = await get(employeeRef);
      const employeeData = employeeSnapshot.val();
      if (!employeeData) continue; // Check if employeeData exists
      const employeeProjects = employeeData.projects || [];
      const updatedEmployeeProjects = employeeProjects.filter(
        (proj) => proj !== id
      );
      const updatedEmployee = {
        ...employeeData,
        projects: updatedEmployeeProjects,
      };
      updates[`employees/${employeeId}`] = updatedEmployee;
      updatedEmails.push(employeeData);
    }

    await update(ref(db), updates);

    for (const employeeId of values.employees) {
      await updateEmployeeStatus(employeeId);
    }

    await sendEmail(updatedEmails, projectData.name, "removed");
    await logHistory(updatedEmails, projectData.name, "unassigned");

    message.success(t("Employees unassigned successfully!"));
    setIsUnassignModalOpen(false);
    unassignForm.resetFields();
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
    <>
      <BackButton />
      <Card
        title={project ? project.name : t("Project Details")}
        style={{ margin: 60 }}
      >
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
              onClick={() => {
                assignForm.resetFields(); // Reset form fields before showing Modal
                setIsAssignModalOpen(true);
              }}
              style={{
                marginTop: 20,
                backgroundColor: "green",
                borderColor: "green",
              }}
              icon={<PlusOutlined />}
            >
              {t("Assign Employees")}
            </Button>
            <Button
              type="danger"
              onClick={() => {
                unassignForm.resetFields(); // Reset form fields before showing Modal
                setIsUnassignModalOpen(true);
              }}
              style={{
                marginTop: 20,
                marginLeft: 10,
                backgroundColor: employees.length === 0 ? "gray" : "#ff4d4f",
                color: "white",
                borderColor: employees.length === 0 ? "gray" : "#ff4d4f",
                cursor: employees.length === 0 ? "not-allowed" : "pointer",
              }}
              disabled={employees.length === 0}
              icon={<MinusOutlined />}
            >
              {t("Unassign Employees")}
            </Button>
            <Modal
              title={t("Assign Employees to Project")}
              open={isAssignModalOpen}
              onCancel={() => setIsAssignModalOpen(false)}
              footer={null}
            >
              <Form form={assignForm} onFinish={handleAssign} layout="vertical">
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
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "green",
                      borderColor: "green",
                    }}
                  >
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
              <Form
                form={unassignForm}
                onFinish={handleUnassign}
                layout="vertical"
              >
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
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#ff4d4f",
                      borderColor: "#ff4d4f",
                    }}
                  >
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
    </>
  );
};

export default DetailProject;
