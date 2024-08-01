import React, { useEffect, useState } from "react";
import { Button, Card, Avatar, Row, Col, message } from "antd";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import styles from "../../styles/layouts/ProfileDetail.module.scss";

const ProfileDetail = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
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

    fetchUserData();
  }, [navigate, t]);

  const exportToPDF = async () => {
    const input = document.getElementById("profile-detail");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProperties = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("profile-detail.pdf");
  };

  if (!userData) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div className={styles.profilePage} id="profile-detail">
      <Card title={t("Profile Detail")} className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <Avatar size={100} src={userData.profilePicture} />
          <div className={styles.userInfo}>
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
            <Button type="primary" onClick={() => navigate("/edit-profile")}>
              {t("Edit Profile")}
            </Button>
            <Button onClick={exportToPDF} className={styles.exportButton}>
              {t("Export to PDF")}
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
      </Card>
    </div>
  );
};

export default ProfileDetail;
