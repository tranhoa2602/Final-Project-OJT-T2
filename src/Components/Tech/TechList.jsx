import React, { useEffect, useState } from "react";
import { Space, Table, Button, Tag, message } from "antd";
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

  const handleDelete = async (id, status) => {
    if (status === "Active") {
      message.error("Can't delete status active");
      return;
    }
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
      title: t("Tech Status"),
      dataIndex: "techstatus",
      key: "techstatus",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: t("Tech Description"),
      dataIndex: "techdescription",
      key: "techdescription",
    },
    {
      title: t("Actions"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/EditTech/${record.id}`}> Edit </Link>{" "}
          <a onClick={() => handleDelete(record.id, record.techstatus)}> Delete </a>{" "}
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
