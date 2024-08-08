import React, { useEffect, useState } from "react";
import { Descriptions, Button, Tag, Card, Spin, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDatabase, ref, get } from "firebase/database";
import exportEmployeeCV from "../Employee_Information/EmployeeCV";
import BackButton from "../../layouts/BackButton";

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { employee } = state;
  const [projects, setProjects] = useState([]);
  const [employeeName, setEmployeeName] = useState(employee?.name || "");

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
        setEmployeeName(employee.name); // Cập nhật tên của nhân viên
      }
    };

    if (employee.projects) {
      fetchProjects(employee.projects);
    }
  }, [employee.projects, employee.name]);

  const returnToPrevious = () => {
    navigate("/list");
  };

  const handleExportCV = () => {
    // Xác định biến translations
    const translations = {
      addressLabel: t("Address"),
      emailLabel: t("Email"),
      workingExperience: t("WORKING EXPERIENCE"),
      typicalProjects: t("TYPICAL PROJECTS"),
      projectName: t("Project Name"),
      roleLabel: t("Role"),
      descriptionLabel: t("Description"),
      specificationLabel: t("Specification"),
      languagesFrameworkLabel: t("Languages and Framework"),
      technologiesLabel: t("Technologies"),
    };

    // Gọi hàm exportEmployeeCV với tất cả các tham số cần thiết
    exportEmployeeCV(employee, projects, translations);
  };

  return (
    <>
      <BackButton />
      <Typography.Title style={{ textAlign: "center", fontSize: "20px" }}>
        {t("Employee Detail")} : {employeeName}
      </Typography.Title>
      <Descriptions bordered column={1} style={{ marginTop: "20px" }}>
        <Descriptions.Item label={t("Employee Name")}>
          {employee.name}
        </Descriptions.Item>
        <Descriptions.Item label={t("Email")}>
          {employee.email}
        </Descriptions.Item>
        <Descriptions.Item label={t("Phone")}>
          {employee.phone}
        </Descriptions.Item>
        <Descriptions.Item label={t("Role")}>{employee.role}</Descriptions.Item>
        <Descriptions.Item label={t("Status")}>
          {employee.status}
        </Descriptions.Item>
        <Descriptions.Item label={t("Position")}>
          {employee.positionName}
        </Descriptions.Item>
        <Descriptions.Item label={t("Projects")}>
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
