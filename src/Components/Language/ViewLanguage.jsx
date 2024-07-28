import React, { useEffect, useState } from "react";
import { Space, Table, Button, Tag, Switch, message } from "antd";
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
  }, []);

  const handleDelete = async (id) => {
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

  const handleStatusChange = async (id, checked) => {
    try {
      const programing = data.find((item) => item.id === id);
      if (programing) {
        const updatedprograming = { ...programing, programingstatus: checked ? "Active" : "Inactive" };
        await axios.put(
          `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`,
          updatedprograming
        );
        setData(data.map((item) => (item.id === id ? updatedprograming : item)));
        message.success("Programing Language status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating Programing Language status: ", error);
      message.error("Failed to update Programing Language status.");
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
      title: "Status",
      dataIndex: "programingstatus",
      key: "programingstatus",
      render: (status, record) => (
        <Switch
          checked={status === "Active"}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
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
