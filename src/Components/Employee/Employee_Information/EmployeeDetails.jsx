import React, { useState, useEffect } from 'react';
import { Descriptions, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDatabase, ref, get } from "firebase/database";
import { useTranslation } from 'react-i18next';

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { employee } = state;
  const [positionName, setPositionName] = useState("");
  const [projectNames, setProjectNames] = useState([]);

  useEffect(() => {
    const fetchPositionName = async () => {
      const db = getDatabase();
      const positionRef = ref(db, `positions/${employee.positionId}`);
      const snapshot = await get(positionRef);
      if (snapshot.exists()) {
        setPositionName(snapshot.val().name);
      }
    };

    const fetchProjectNames = async () => {
      const db = getDatabase();
      const projectRefs = employee.projectIds.map(id => ref(db, `projects/${id}`));
      const projectSnapshots = await Promise.all(projectRefs.map(ref => get(ref)));
      const names = projectSnapshots.map(snapshot => snapshot.exists() ? snapshot.val().name : t('Unknown Project'));
      setProjectNames(names);
    };

    fetchPositionName();
    fetchProjectNames();
  }, [employee.positionId, employee.projectIds, t]);

  const returntoPrevious = () => {
    navigate('/list');
  };

  const handleDownloadCv = () => {
    if (!employee.cv_file) {
      console.error("CV file not found");
      return;
    }

    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${employee.cv_file}`;
    link.download = `${employee.name}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Descriptions
        title={t("Employee Details")}
        bordered
        column={{
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
      >
        <Descriptions.Item label={t("Employee Name")}>{employee.name}</Descriptions.Item>
        <Descriptions.Item label={t("Email")}>{employee.email}</Descriptions.Item>
        <Descriptions.Item label={t("Phone")}>{employee.phone}</Descriptions.Item>
        <Descriptions.Item label={t("Role")}>{employee.role}</Descriptions.Item>
        <Descriptions.Item label={t("Status")}>{employee.status}</Descriptions.Item>
        <Descriptions.Item label={t("Position")}>{positionName}</Descriptions.Item>
        <Descriptions.Item label={t("Projects")}>{projectNames.join(", ")}</Descriptions.Item>
        <Descriptions.Item label={t("Skills")}>{employee.skills}</Descriptions.Item>
        <Descriptions.Item label={t("Contact")}>{employee.contact}</Descriptions.Item>
        <Descriptions.Item label={t("CV Skill")}>{employee.cv_list[0].cv_skill}</Descriptions.Item>
      </Descriptions>

      <Button type="primary" onClick={handleDownloadCv} style={{ background: 'blue', marginTop: '20px' }}>
        {t("Export CV")}
      </Button>
      <Button type="primary" onClick={returntoPrevious} style={{ background: 'gray', marginTop: '20px' }}>
        {t("Return")}
      </Button>
    </>
  );
};

export default EmployeeDetails;
