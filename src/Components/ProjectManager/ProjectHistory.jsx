import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ProjectHistory = () => {
  const { t } = useTranslation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/projecthistory.json`
        );
        const result = response.data;

        if (!result) {
          setHistoryData([]);
          return;
        }

        const historyList = Object.keys(result).map(key => ({
          id: key,
          ...result[key]
        }));

        historyList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setHistoryData(historyList);
      } catch (error) {
        console.error("Error fetching history data: ", error);
        message.error(t("Failed to fetch history data."));
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [t]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${firebaseConfig.databaseURL}/projecthistory/${id}.json`);
      message.success(t("Deleted history successfully!"));
      setHistoryData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      message.error(t("Failed to delete entry."));
    }
  };

  const columns = [
    {
      title: t("Action"),
      dataIndex: "action",
      key: "action",
      render: (text, record) => `${record.user} ${record.action} ${record.projectname}`,
    },
    {
      title: t("Timestamp"),
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: t("Actions"),
      key: "actions",
      render: (text, record) => (
        <Button
          type="danger"
          onClick={() => handleDelete(record.id)}
        >
          {t("Delete")}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/ProjectList")}
      >
        {t("Back to Project List")}
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={historyData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default ProjectHistory;
