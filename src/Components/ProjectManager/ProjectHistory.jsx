import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Space, Skeleton } from "antd";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import BackButton from "../layouts/BackButton";

const ProjectHistory = () => {
  const { t } = useTranslation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to delete this history entry?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        try {
          await axios.delete(
            `${firebaseConfig.databaseURL}/projecthistory/${id}.json`
          );
          message.success(t("Deleted history successfully!"));
          setHistoryData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
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
      render: (text, record) =>
        `${record.user} ${record.action} ${record.projectname}`,
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
        <Button type="danger" onClick={() => handleDelete(record.id)}>
          {t("Delete")}
        </Button>
      ),
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
        />
      )}
    </div>
  );
};

export default ProjectHistory;
