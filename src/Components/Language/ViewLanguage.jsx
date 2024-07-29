import React, { useEffect, useState } from "react";
import { Space, Table, Button, Tag, message, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const ViewLanguage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
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

        setData(languages);
        setFilteredData(languages); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching Programming Languages: ", error);
        message.error(t("Failed to fetch Programming Languages."));
      }
    };

    fetchData();
  }, [t]);

  useEffect(() => {
    const filterData = () => {
      let filtered = data;

      if (searchName) {
        filtered = filtered.filter(item =>
          item.programingname.toLowerCase().includes(searchName.toLowerCase())
        );
      }

      if (searchType) {
        filtered = filtered.filter(item =>
          item.programingtype.some(type =>
            type.toLowerCase().includes(searchType.toLowerCase())
          )
        );
      }

      if (searchStatus) {
        filtered = filtered.filter(item =>
          item.programingstatus.toLowerCase() === searchStatus.toLowerCase()
        );
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [searchName, searchType, searchStatus, data]);

  const handleDelete = async (id, status) => {
    if (status === "Active") {
      message.error(t("Can't delete status active"));
      return;
    }
    try {
      await axios.delete(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
      );
      message.success(t("Programming Language deleted successfully!"));
      setData(data.filter((item) => item.id !== id));
      setFilteredData(filteredData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting Programming Language: ", error);
      message.error(t("Failed to delete Programming Language."));
    }
  };

  const handleNameFilter = (value) => {
    setSearchName(value);
  };

  const handleTypeFilter = (value) => {
    setSearchType(value);
  };

  const handleStatusFilter = (value) => {
    setSearchStatus(value);
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "programingname",
      key: "programingname",
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={t("Search by Name")}
            value={searchName}
            onChange={(e) => handleNameFilter(e.target.value)}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      onFilter: (value, record) =>
        record.programingname.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: t("Type"),
      dataIndex: "programingtype",
      key: "programingtype",
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={t("Search by Type")}
            value={searchType}
            onChange={(e) => handleTypeFilter(e.target.value)}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      onFilter: (value, record) =>
        record.programingtype.some(type =>
          type.toLowerCase().includes(value.toLowerCase())
        ),
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
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder={t("Select Status")}
            value={searchStatus}
            onChange={(value) => handleStatusFilter(value)}
            style={{ width: 200 }}
          >
            <Option value="">{t("All")}</Option>
            <Option value="Active">{t("Active")}</Option>
            <Option value="Inactive">{t("Inactive")}</Option>
          </Select>
        </div>
      ),
      onFilter: (value, record) =>
        record.programingstatus.toLowerCase().includes(value.toLowerCase()),
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
          <Link to={`/EditLanguage/${record.id}`}> {t("Edit")} </Link>
          <a onClick={() => handleDelete(record.id, record.programingstatus)}> {t("Delete")} </a>
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
      <Table columns={columns} dataSource={filteredData} rowKey="id" />
    </>
  );
};

export default ViewLanguage;
