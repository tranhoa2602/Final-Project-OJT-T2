import React, { useEffect, useState } from "react";
import { Button, Card, Avatar, Row, Col, message } from "antd";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import * as Docx from "docx";
import { getDownloadURL, ref as firebaseStorageRef } from "firebase/storage";
import { storage } from "../../../firebaseConfig"; // Import storage từ cấu hình Firebase của bạn
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
          const userRef = ref(db, `users/${storedUser.key}`);
          const snapshot = await get(userRef);
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

  const getBase64ImageFromUrl = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const exportToWord = async () => {
    if (!userData) return;

    let profilePictureBase64 = null;
    if (userData.profilePicture) {
      try {
        const downloadUrl = await getDownloadURL(
          firebaseStorageRef(storage, userData.profilePicture)
        );
        profilePictureBase64 = await getBase64ImageFromUrl(downloadUrl);
      } catch (error) {
        console.error("Error fetching profile picture: ", error);
      }
    }

    const children = [
      new Docx.Paragraph({
        text: t("Profile Detail"),
        heading: Docx.HeadingLevel.HEADING_1,
      }),
      new Docx.Paragraph({
        text: `${userData.name}`,
        heading: Docx.HeadingLevel.HEADING_2,
      }),
      new Docx.Paragraph({
        text: `${userData.email}`,
      }),
      new Docx.Paragraph({
        children: [
          new Docx.TextRun({
            text: `${t("Phone")}: `,
            bold: true,
          }),
          new Docx.TextRun(userData.phone),
        ],
      }),
      new Docx.Paragraph({
        children: [
          new Docx.TextRun({
            text: `${t("Role")}: `,
            bold: true,
          }),
          new Docx.TextRun(t(userData.role)),
        ],
      }),
      new Docx.Paragraph({
        children: [
          new Docx.TextRun({
            text: `${t("Status")}: `,
            bold: true,
          }),
          new Docx.TextRun(t(userData.status)),
        ],
      }),
      new Docx.Paragraph({
        children: [
          new Docx.TextRun({
            text: `${t("Skills")}: `,
            bold: true,
          }),
          new Docx.TextRun(userData.skill),
        ],
      }),
      new Docx.Paragraph({
        children: [
          new Docx.TextRun({
            text: `${t("Address")}: `,
            bold: true,
          }),
          new Docx.TextRun(userData.address),
        ],
      }),
      new Docx.Paragraph({
        children: [
          new Docx.TextRun({
            text: `${t("Work Experience")}: `,
            bold: true,
          }),
          new Docx.TextRun(userData.experience),
        ],
      }),
      new Docx.Paragraph({
        children: [
          new Docx.TextRun({
            text: `${t("Education")}: `,
            bold: true,
          }),
          new Docx.TextRun(userData.education),
        ],
      }),
    ];

    if (profilePictureBase64) {
      children.unshift(
        new Docx.Paragraph({
          children: [
            new Docx.ImageRun({
              data: profilePictureBase64.split(",")[1], // Remove the 'data:image/png;base64,' part
              transformation: {
                width: 100,
                height: 100,
              },
            }),
          ],
          alignment: Docx.AlignmentType.CENTER,
        })
      );
    }

    const doc = new Docx.Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    Docx.Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "ProfileDetail.docx");
    });
  };

  if (!userData) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div className={styles.profilePage}>
      <Card title={t("Profile Detail")} className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <Avatar size={100} src={userData.profilePicture} />
          <div className={styles.userInfo}>
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
            <Button type="primary" onClick={() => navigate("/edit-profile")}>
              {t("Edit Profile")}
            </Button>
            <Button onClick={exportToWord}>{t("Export to Word")}</Button>
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
              <strong>{t("Skills")}:</strong> {userData.skill}
            </p>
          </Col>
        </Row>
        <p>
          <strong>{t("Address")}:</strong> {userData.address}
        </p>
        <p>
          <strong>{t("Work Experience")}:</strong> {userData.experience}
        </p>
        <p>
          <strong>{t("Education")}:</strong> {userData.education}
        </p>
      </Card>
    </div>
  );
};

export default ProfileDetail;
