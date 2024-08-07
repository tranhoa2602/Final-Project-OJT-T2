// BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "../../styles/layouts/main.css"; // Import file CSS

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate -1 sẽ quay lại trang trước đó
  };

  return (
    <Button
      onClick={handleBack}
      icon={<ArrowLeftOutlined />}
      className="back-button"
    >
      Back
    </Button>
  );
};

export default BackButton;
