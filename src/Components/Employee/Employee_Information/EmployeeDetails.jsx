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
      const positionRef = ref(db, `positions/${employee.positionName}`);
      const snapshot = await get(positionRef);
      if (snapshot.exists()) {
        setPositionName(snapshot.val().name);
      }
    };

    const fetchProjectNames = async () => {
      const db = getDatabase();
      const projectRefs = employee.projectNames.map(name => ref(db, `projects/${name}`));
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
      console.error(t("CV file not found"));
      return;
    }

    const link = document.createElement('a');
    link.href = employee.cv_file;
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
        column={1}
      >
        <Descriptions.Item label="Employee Name">{employee.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{employee.phone}</Descriptions.Item>
        <Descriptions.Item label="Role">{employee.role}</Descriptions.Item>
        <Descriptions.Item label="Status">{employee.status}</Descriptions.Item>
        <Descriptions.Item label="Position">{employee.positionName}</Descriptions.Item>
        <Descriptions.Item label="Projects">{employee.projectNames.join(", ")}</Descriptions.Item>
        <Descriptions.Item label="Skill">{employee.cv_list[0].cv_skill}</Descriptions.Item>
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
