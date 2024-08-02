import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Avatar,
  Row,
  Col,
  message,
  Select,
  List,
  Popconfirm,
} from "antd";
import { getDatabase, ref, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../../styles/layouts/ProfileDetail.module.scss";

const { Option } = Select;

const ProfileDetail = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.key) {
          const db = getDatabase();

          // Try to get user data from "users" reference
          let userRef = ref(db, `users/${storedUser.key}`);
          let snapshot = await get(userRef);

          if (!snapshot.exists()) {
            // If not found, try to get data from "employees" reference
            userRef = ref(db, `employees/${storedUser.key}`);
            snapshot = await get(userRef);
          }

          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            message.error(t("User data not found"));
            navigate("/");
          }
        } else {
          message.error(t("User not authenticated"));
          navigate("/");
        }
      } catch (error) {
        console.error(t("Error fetching user data: "), error);
        message.error(t("Error fetching user data"));
      }
    };

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
        setAvailableProjects(formattedData);
      }
    };

    fetchUserData();
    fetchProjects();
  }, [navigate, t]);

  const handleJoinProject = async () => {
    if (!userData || !userData.key) {
      message.error(t("User data not available"));
      return;
    }
    if (!selectedProject) {
      message.error(t("Please select a project first"));
      return;
    }
    try {
      const db = getDatabase();
      const userRef = ref(db, `employees/${userData.key}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userProjects = userData.projects || [];
        if (userProjects.includes(selectedProject)) {
          message.error(t("User is already in this project"));
          return;
        }
        userProjects.push(selectedProject);
        await update(userRef, { projects: userProjects });
        setUserData({ ...userData, projects: userProjects });
        message.success(t("Project joined successfully"));
      }
    } catch (error) {
      console.error(t("Error joining project: "), error);
      message.error(t("Error joining project"));
    }
  };

  const handleRemoveProject = async (projectId) => {
    if (!userData || !userData.key) {
      message.error(t("User data not available"));
      return;
    }
    try {
      const db = getDatabase();
      const userRef = ref(db, `employees/${userData.key}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userProjects = userData.projects || [];
        const updatedProjects = userProjects.filter((id) => id !== projectId);
        await update(userRef, { projects: updatedProjects });
        setUserData({ ...userData, projects: updatedProjects });
        message.success(t("Project removed successfully"));
      }
    } catch (error) {
      console.error(t("Error removing project: "), error);
      message.error(t("Error removing project"));
    }
  };

  if (!userData) {
    return <div>{t("Loading...")}</div>;
  }

  const userProjects = projects.filter((project) =>
    (userData.projects || []).includes(project.id)
  );

  return (
    <div className={styles.profilePage} id="profile-detail">
      <Card title={t("Profile Detail")} className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <Avatar size={200} src={userData.profilePicture} />
          <div className={styles.userInfo}>
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
            <Button type="primary" onClick={() => navigate("/edit-profile")}>
              {t("Edit Profile")}
            </Button>
          </div>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <p>
              <strong>{t("Phone")}:</strong> {userData.phone}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <strong>{t("Role")}:</strong> {t(userData.role)}
            </p>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <p>
              <strong>{t("Status")}:</strong> {t(userData.status)}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <strong>{t("Position")}:</strong> {userData.positionName}
            </p>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <p>
              <strong>{t("Skills")}:</strong> {userData.skill}
            </p>
          </Col>
          <Col span={12}>
            <p>
              <strong>{t("Address")}:</strong> {userData.address}
            </p>
          </Col>
        </Row>
        <p>
          <strong>{t("Work Experience")}:</strong>
          {userData.cv_list &&
          userData.cv_list.length > 0 &&
          userData.cv_list[0].cv_experience
            ? userData.cv_list[0].cv_experience.map((exp, index) => (
                <span key={index}>
                  {exp.description}
                  {index < userData.cv_list[0].cv_experience.length - 1 && ", "}
                </span>
              ))
            : t("No work experience available")}
        </p>
        <p>
          <strong>{t("Education")}:</strong> {userData.education}
        </p>

        <div className={styles.projectSection}>
          <h3>{t("Projects")}</h3>
          <List
            bordered
            dataSource={userProjects}
            renderItem={(project) => (
              <List.Item
                actions={[
                  <Popconfirm
                    title={t("Are you sure to remove this project?")}
                    onConfirm={() => handleRemoveProject(project.id)}
                  >
                    <Button>{t("Remove")}</Button>
                  </Popconfirm>,
                ]}
              >
                {project.name}
              </List.Item>
            )}
          />
        </div>

        <div className={styles.joinProjectSection}>
          <h3>{t("Join a Project")}</h3>
          <Row gutter={16}>
            <Col span={18}>
              <Select
                style={{ width: "100%" }}
                placeholder={t("Select a project")}
                onChange={(value) => setSelectedProject(value)}
              >
                {availableProjects.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Button type="primary" onClick={handleJoinProject}>
                {t("Join")}
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ProfileDetail;
