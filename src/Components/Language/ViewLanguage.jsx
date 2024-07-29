import React, { useEffect, useState } from "react";
import { Space, Table, Button, Tag, message } from "antd";
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
        const ViewLanguage = [];

        for (const key in result) {
          ViewLanguage.push({ id: key, ...result[key] });
        }

        setData(ViewLanguage);
      } catch (error) {
        console.error("Error fetching Programing Language: ", error);
        message.error("Failed to fetch Programing Language.");
      }
    };

    fetchData();
  }, [t]);

  const handleDelete = async (id, status) => {
    if (status === "Active") {
      message.error("Can't delete status active");
      return;
    }
    try {
      await axios.delete(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
      );
      message.success("Programing Language deleted successfully!");
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting Programing Language: ", error);
      message.error("Failed to delete Programing Language.");
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
      render: (tags) => (
        <>
          {Array.isArray(tags) ? tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          )) : null}
        </>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "programingstatus",
      key: "programingstatus",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
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
          <Link to={`/EditLanguage/${record.id}`}> Edit </Link>{" "}
          <a onClick={() => handleDelete(record.id, record.programingstatus)}> Delete </a>{" "}
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
