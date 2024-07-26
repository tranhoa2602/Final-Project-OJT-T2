import React, { useEffect, useState } from "react";
import { Space, Table, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";

const ViewLanguage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/programmingLanguages.json`
        );
        const result = response.data;
        const techList = [];

        for (const key in result) {
          techList.push({ id: key, ...result[key] });
        }

        setData(techList);
      } catch (error) {
        console.error("Error fetching programmingLanguages: ", error);
        message.error(t("Failed to fetch programmingLanguages."));
      }
    };

    fetchData();
  }, [t]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
      );
      message.success(t("Programming Languages deleted successfully!"));
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting Programming Languages: ", error);
      message.error(t("Failed to delete Programming Languages."));
    }
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "programingname",
      key: "programingname",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("Type"),
      dataIndex: "programingtype",
      key: "programingtype",
    },
    {
      title: t("Status"),
      dataIndex: "programingstatus",
      key: "programingstatus",
    },
    {
      title: t("Description"),
      dataIndex: "programingdescription",
      key: "programingdescription",
    },
    {
      title: t("Actions"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/EditLanguage/${record.id}`}>{t("Edit")}</Link>
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
        onClick={() => navigate("/AddLanguage")}
      >
        {t("Add Programming Language")}
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </>
  );
};

export default ViewLanguage;
