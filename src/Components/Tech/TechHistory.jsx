import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TechHistory = () => {
  const { t } = useTranslation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/techhistory.json`
        );
        const result = response.data;
        console.log(result);
        
        const historyList = [];

        for (const key in result) {
          historyList.push({ id: key, ...result[key] });
        }

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

  const handleDelete = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to delete this entry from history?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        try {
          await axios.delete(`${firebaseConfig.databaseURL}/techhistory/${id}.json`);
          message.success(t("Deleted history successfully!"));
          setHistoryData(prevData => prevData.filter(item => item.id !== id));
        } catch (error) {
          console.error("Error deleting entry:", error);
          message.error(t("Failed to delete entry."));
        }
      },
    });
  };

  const columns = [
    {
      title: t("Action"),
      dataIndex: "action",
      key: "action",
      render: (text, record) => `${record.user} ${record.action} ${record.techname}`,
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
        onClick={() => navigate("/TechList")} 
      >
        {t("Back to Tech List")}
      </Button>
      <Table
        columns={columns}
        dataSource={historyData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TechHistory;
