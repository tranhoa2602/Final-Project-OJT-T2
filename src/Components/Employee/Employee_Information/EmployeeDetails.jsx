import React, { useEffect, useState } from "react";
import { Descriptions, Button, Tag, Card } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDatabase, ref, get } from "firebase/database";
import exportEmployeeCV from "../Employee_Information/EmployeeCV";

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { employee } = state;
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async (projectIds) => {
      const db = getDatabase();
      const projectsRef = ref(db, "projects");
      const snapshot = await get(projectsRef);

      if (snapshot.exists()) {
        const allProjects = snapshot.val();
        const assignedProjects = projectIds.map((projId) => ({
          id: projId,
          ...allProjects[projId],
        }));
        setProjects(assignedProjects);
      }
    };

    if (employee.projects) {
      fetchProjects(employee.projects);
    }
  }, [employee.projects]);

  const returnToPrevious = () => {
    navigate("/list");
  };

  const handleExportCV = () => {
    exportEmployeeCV(employee, projects);
  };

  return (
    <>
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <Button
          type="primary"
          onClick={returnToPrevious}
          style={{ background: "gray" }}
        >
          {t("Return")}
        </Button>
      </div>

      <Descriptions
        title={t("Employee Details")}
        bordered
        column={1}
        style={{ marginTop: "60px" }}
      >
        <Descriptions.Item label="Employee Name">
          {employee.name}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{employee.phone}</Descriptions.Item>
        <Descriptions.Item label="Role">{employee.role}</Descriptions.Item>
        <Descriptions.Item label="Status">{employee.status}</Descriptions.Item>
        <Descriptions.Item label="Position">
          {employee.positionName}
        </Descriptions.Item>
        <Descriptions.Item label="Projects">
          {projects.length > 0
            ? projects.map((project) => (
                <Tag key={project.id} color="blue">
                  {project.name}
                </Tag>
              ))
            : t("No projects assigned")}
        </Descriptions.Item>
      </Descriptions>

      <Card title={t("Projects")} style={{ marginTop: "20px" }}>
        {projects.length > 0
          ? projects.map((project) => (
              <Card key={project.id} style={{ marginBottom: "10px" }}>
                <p>
                  <strong>{t("Project Name")}: </strong>
                  {project.name}
                </p>
                <p>
                  <strong>{t("Role")}: </strong>
                  {employee.positionName}
                </p>
                <p>
                  <strong>{t("Description")}: </strong>
                  {project.description}
                </p>
                <p>
                  <strong>{t("Specification")}: </strong>
                  {employee.specification}
                </p>
                <p>
                  <strong>{t("Languages and Framework")}: </strong>
                  {project.programmingLanguage.join(", ")}
                </p>
                <p>
                  <strong>{t("Technologies")}: </strong>
                  {project.technology.join(", ")}
                </p>
              </Card>
            ))
          : t("No projects assigned")}
      </Card>

      <Button
        type="primary"
        onClick={handleExportCV}
        style={{ background: "blue", marginTop: "20px" }}
      >
        {t("Export CV")}
      </Button>
    </>
  );
};

export default EmployeeDetails;
