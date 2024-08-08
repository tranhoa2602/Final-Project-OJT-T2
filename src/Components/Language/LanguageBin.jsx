import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, message, Skeleton, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { RedoOutlined, DeleteOutlined } from "@ant-design/icons";
import { getDatabase, ref, update, remove } from "firebase/database";

const LanguageBin = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${firebaseConfig.databaseURL}/programmingLanguages.json`);
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

  useEffect(() => {
    fetchData();
  }, [t]);

  const handleRestore = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to restore this programming language from the bin?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        try {
          // Initialize Firebase Realtime Database
          const db = getDatabase();
          const languageRef = ref(db, `programmingLanguages/${id}`);
          
          // Update the `deleteStatus` to false
          await update(languageRef, { deletestatus: false });
          
          // Show success message
          message.success(t("Programming Language restored successfully!"));
          
          // Refresh the list of programming languages
          await fetchData(); // Ensure fetchData is correctly implemented
        } catch (error) {
          // Log and display error message
          console.error("Error restoring programming language:", error.message);
          message.error(t(`Failed to restore programming language: ${error.message}`));
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
          // Initialize Firebase Realtime Database
          const db = getDatabase();
          const languageRef = ref(db, `programmingLanguages/${id}`);
          
          // Permanently delete the programming language
          await remove(languageRef);
          
          // Show success message
          message.success(t("Programming Language permanently deleted!"));
          
          // Refresh the list of programming languages
          await fetchData(); // Ensure fetchData is correctly implemented
        } catch (error) {
          // Log and display error message
          console.error("Error deleting Programming Language:", error.message);
          message.error(t(`Failed to delete Programming Language: ${error.message}`));
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
