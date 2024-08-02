import React, { useState, useEffect } from "react";
import { Descriptions, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { useTranslation } from "react-i18next";

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { employee } = state;
  const [positionName, setPositionName] = useState("");

  useEffect(() => {
    const fetchPositionName = async () => {
      const db = getDatabase();
      const positionRef = ref(db, `positions/${employee.positionName}`);
      const snapshot = await get(positionRef);
      if (snapshot.exists()) {
        setPositionName(snapshot.val().name);
      }
    };

    fetchPositionName();
  }, [employee.positionName, t]);

  const returnToPrevious = () => {
    navigate("/list");
  };

  const handleDownloadCv = () => {
    if (!employee.cv_file) {
      console.error(t("CV file not found"));
      return;
    }

    window.open(employee.cv_file, "_blank");
  };

  return (
    <>
      <Descriptions title={t("Employee Details")} bordered column={1}>
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
      </Descriptions>

      <Button
        type="primary"
        onClick={handleDownloadCv}
        style={{ background: "blue", marginTop: "20px" }}
      >
        {t("Export CV")}
      </Button>

      <Button
        type="primary"
        onClick={returnToPrevious}
        style={{ background: "gray", marginTop: "20px" }}
      >
        {t("Return")}
      </Button>
    </>
  );
};

export default EmployeeDetails;
