import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "../../styles/layouts/main.css";

const BackButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate(-1); // Navigate -1 sẽ quay lại trang trước đó
  };

  return (
    <Button onClick={handleBack} className="back-button">
      <ArrowLeftOutlined /> {t("Back")}
    </Button>
  );
};

export default BackButton;
