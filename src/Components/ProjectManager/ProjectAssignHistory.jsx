import React, { useEffect, useState } from "react";
import { Table, message, Space, Skeleton } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import BackButton from "../layouts/BackButton";
import "../../styles/layouts/tablestyles.scss";

const ProjectAssignHistory = () => {
  const { t } = useTranslation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/projectassignhistory.json`
        );
        const result = response.data;

        if (!result) {
          setHistoryData([]);
          return;
        }

        const historyList = Object.keys(result).map((key) => ({
          id: key,
          ...result[key],
        }));

        historyList.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

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
      title: t("Action"),
      dataIndex: "action",
      key: "action",
      render: (text, record) =>
        `${record.user} ${record.action} ${record.employeeName} to/from ${record.projectName}`,
    },
    {
      title: t("Timestamp"),
      dataIndex: "timestamp",
      key: "timestamp",
    },
  ];

  return (
    <div>
      <Space style={{ marginTop: 16, marginBottom: 45 }}>
        <BackButton />
      </Space>
      {loading ? (
        <Skeleton
          active
          paragraph={{ rows: 5 }}
          title={false}
          className="custom-skeleton"
        />
      ) : (
        <Table
          columns={columns}
          dataSource={historyData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          className="custom-table"
        />
      )}
    </div>
  );
};

export default ProjectAssignHistory;
