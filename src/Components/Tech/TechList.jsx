import React, { useEffect, useState } from "react";
import { Space, Table, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";

const TechList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/technologies.json`
        );
        const result = response.data;
        const techList = [];

        for (const key in result) {
          techList.push({ id: key, ...result[key] });
        }

        setData(techList);
      } catch (error) {
        console.error("Error fetching technologies: ", error);
        message.error(t("Failed to fetch technologies."));
      }
    };

    fetchData();
  }, [t]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${firebaseConfig.databaseURL}/technologies/${id}.json`
      );
      message.success(t("Technology deleted successfully!"));
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting technology: ", error);
      message.error(t("Failed to delete technology."));
    }
  };

  const columns = [
    {
      title: t("Tech Name"),
      dataIndex: "techname",
      key: "techname",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("Tech Type"),
      dataIndex: "techtype",
      key: "techtype",
    },
    {
      title: t("Tech Status"),
      dataIndex: "techstatus",
      key: "techstatus",
    },
    {
      title: t("Tech Description"),
      dataIndex: "techdescription",
      key: "techdescription",
    },
    {
      title: t("Action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/EditTech/${record.id}`}>{t("Edit")}</Link>
          <a onClick={() => handleDelete(record.id)}>{t("Delete")}</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/AddTech")}
      >
        {t("Add Tech")}
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </>
  );
};

export default TechList;
