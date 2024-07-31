import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { Card, Descriptions, Spin, message, Button, Tag } from "antd";
import { useTranslation } from "react-i18next";
import moment from "moment";

const DetailProject = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const db = getDatabase();
      const projectRef = ref(db, `projects/${id}`);
      const snapshot = await get(projectRef);
      if (snapshot.exists()) {
        setProject(snapshot.val());
      } else {
        message.error(t("Project not found"));
      }
      setLoading(false);
    };

    fetchProject();
  }, [id, t]);

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
            <Descriptions.Item label={t("Project Manager")}>
              {project.projectManager}
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
          </Descriptions>
          <Button
            type="primary"
            onClick={() => navigate("/projects")}
            style={{ marginTop: 20 }}
          >
            {t("Back to Project List")}
          </Button>
        </>
      ) : (
        <p>{t("Project not found")}</p>
      )}
    </Card>
  );
};

export default DetailProject;
