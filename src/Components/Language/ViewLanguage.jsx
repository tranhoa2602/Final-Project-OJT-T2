import React, { useEffect, useState } from "react";
import { Space, Table, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";

const ViewLanguage = () => {
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
        message.error("Failed to fetch programmingLanguages.");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
      );
      message.success("Programing Languages deleted successfully!");
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting Programing Languages: ", error);
      message.error("Failed to delete Programing Languages.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "programingname",
      key: "programingname",
      render: (text) => <a> {text} </a>,
    },
    {
      title: "Type",
      dataIndex: "programingtype",
      key: "programingtype",
    },
    {
      title: "Status",
      dataIndex: "programingstatus",
      key: "programingstatus",
    },
    {
      title: "Description",
      dataIndex: "programingdescription",
      key: "programingdescription",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/EditLanguage/${record.id}`}> Edit </Link>{" "}
          <a onClick={() => handleDelete(record.id)}> Delete </a>{" "}
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
        Add Programing Language{" "}
      </Button>{" "}
      <Table columns={columns} dataSource={data} rowKey="id" />
    </>
  );
};

export default ViewLanguage;
