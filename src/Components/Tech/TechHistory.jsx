import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";

const TechHistory = () => {
  const { t } = useTranslation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const columns = [
    {
      title: t("User"),
      dataIndex: "user",
      key: "user",
    },
    {
      title: t("Action"),
      dataIndex: "action",
      key: "action",
      render: (text, record) => `${record.user} deleted ${record.techname}`,
    },
    {
      title: t("Timestamp"),
      dataIndex: "timestamp",
      key: "timestamp",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={historyData}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default TechHistory;
