import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, message, Skeleton, Modal} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { RedoOutlined, DeleteOutlined } from "@ant-design/icons";

const LanguageBin = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/programmingLanguages.json`
        );
        const result = response.data;
        const languages = [];

        for (const key in result) {
          languages.push({ id: key, ...result[key] });
        }

        setData(languages.filter((item) => item.deletestatus === true));
      } catch (error) {
        console.error("Error fetching Programming Languages:", error);
        message.error(t("Failed to fetch Programming Languages."));
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [t]);

  const handleRestore = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to restore this programming language?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        try {
          await axios.patch(
            `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`,
            { deletestatus: false }
          );
          message.success(t("Programming Language restored successfully!"));
          const updatedData = await fetchData(); // Refresh the list
          setData(updatedData);
        } catch (error) {
          console.error("Error restoring Programming Language:", error);
          message.error(t("Failed to restore Programming Language."));
        }
      },
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to permanently delete this programming language?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        try {
          await axios.delete(
            `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
          );
          message.success(t("Programming Language permanently deleted!"));
          const updatedData = await fetchData(); // Refresh the list
          setData(updatedData);
        } catch (error) {
          console.error("Error deleting Programming Language:", error);
          message.error(t("Failed to delete Programming Language."));
        }
      },
    });
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "programingname",
      key: "programingname",
    },
    {
      title: t("Type"),
      dataIndex: "programingtype",
      key: "programingtype",
      render: (tags) => (
        <>
          {Array.isArray(tags)
            ? tags.map((tag) => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))
            : null}
        </>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "programingstatus",
      key: "programingstatus",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: t("Actions"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleRestore(record.id)}>
            <RedoOutlined /> {t("Restore")}
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            <DeleteOutlined /> {t("Delete")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/ViewLanguage")}
      >
        {t("Back to Language List")}
      </Button>
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="id" />
      )}
    </div>
  );
};

export default LanguageBin;
