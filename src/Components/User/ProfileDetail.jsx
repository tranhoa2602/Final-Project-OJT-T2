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

          let userRef = ref(db, `users/${storedUser.key}`);
          let snapshot = await get(userRef);

          if (!snapshot.exists()) {
            userRef = ref(db, `employees/${storedUser.key}`);
            snapshot = await get(userRef);
          }

          if (snapshot.exists()) {
            setUserData(snapshot.val());
            fetchProjects(snapshot.val().projects || []);
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

    const fetchProjects = async (userProjectIds = []) => {
      const db = getDatabase();
      const projectsRef = ref(db, "projects");
      const snapshot = await get(projectsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProjects(
          formattedData.filter((project) => userProjectIds.includes(project.id))
        );
        setAvailableProjects(
          formattedData.filter(
            (project) => !userProjectIds.includes(project.id)
          )
        );
      }
    };

    fetchUserData();
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
      const projectRef = ref(db, `projects/${selectedProject}`);
      const [userSnapshot, projectSnapshot] = await Promise.all([
        get(userRef),
        get(projectRef),
      ]);

      if (userSnapshot.exists() && projectSnapshot.exists()) {
        const userData = userSnapshot.val();
        const projectData = projectSnapshot.val();

        const userProjects = userData.projects || [];
        const projectEmployees = projectData.employees || [];

        if (userProjects.includes(selectedProject)) {
          message.error(t("User is already in this project"));
          return;
        }

        userProjects.push(selectedProject);
        await update(userRef, { projects: userProjects });

        projectEmployees.push(userData.key);
        await update(projectRef, { employees: projectEmployees });

        setUserData({ ...userData, projects: userProjects });
        setProjects((prevProjects) => [
          ...prevProjects,
          availableProjects.find((project) => project.id === selectedProject),
        ]);
        setAvailableProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== selectedProject)
        );

        message.success(t("Project joined successfully"));
      } else {
        message.error(t("Failed to fetch user or project data"));
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
      const projectRef = ref(db, `projects/${projectId}`);
      const [userSnapshot, projectSnapshot] = await Promise.all([
        get(userRef),
        get(projectRef),
      ]);

      if (userSnapshot.exists() && projectSnapshot.exists()) {
        const userData = userSnapshot.val();
        const projectData = projectSnapshot.val();

        const userProjects = userData.projects || [];
        const updatedUserProjects = userProjects.filter(
          (id) => id !== projectId
        );

        const projectEmployees = projectData.employees || [];
        const updatedProjectEmployees = projectEmployees.filter(
          (empId) => empId !== userData.key
        );

        await update(userRef, { projects: updatedUserProjects });
        await update(projectRef, { employees: updatedProjectEmployees });

        setUserData({ ...userData, projects: updatedUserProjects });
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
        setAvailableProjects((prevProjects) => [
          ...prevProjects,
          projects.find((project) => project.id === projectId),
        ]);

        message.success(t("Project removed successfully"));
      } else {
        message.error(t("Failed to fetch user or project data"));
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
          {userData.experience || t("No work experience available")}
        </p>

        <div className={styles.projectSection}>
          <h3>{t("Projects")}</h3>
          <List
            bordered
            dataSource={userProjects}
            renderItem={(project) => <List.Item>{project.name}</List.Item>}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProfileDetail;
