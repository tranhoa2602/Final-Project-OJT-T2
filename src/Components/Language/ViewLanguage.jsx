import React, { useEffect, useState } from "react";
import { Space, Table, Button, Tag, message, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "../../styles/layouts/ViewLanguage.module.scss"; // Import the SCSS module

const { Option } = Select;

const ViewLanguage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
        setFilteredData(languages);
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
        filtered = filtered.filter((item) =>
          item.programingname.toLowerCase().includes(searchName.toLowerCase())
        );
      }

      if (searchType) {
        filtered = filtered.filter((item) =>
          item.programingtype.some((type) =>
            type.toLowerCase().includes(searchType.toLowerCase())
          )
        );
      }

      if (searchStatus) {
        filtered = filtered.filter(
          (item) =>
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

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "programingname",
      key: "programingname",
      filterDropdown: () => (
        <div className={styles["filter-dropdown"]}>
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
        <div className={styles["filter-dropdown"]}>
          <Input
            placeholder={t("Search by Type")}
            value={searchType}
            onChange={(e) => handleTypeFilter(e.target.value)}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      onFilter: (value, record) =>
        record.programingtype.some((type) =>
          type.toLowerCase().includes(value.toLowerCase())
        ),
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
      filterDropdown: () => (
        <div className={styles["filter-dropdown"]}>
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
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
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
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/EditLanguage/${record.id}`)}
          >
            <EditOutlined /> {t("Edit")}
          </Button>
          <Button
            type="primary"
            danger
            disabled={record.programingstatus === "Active"}
            onClick={() => handleDelete(record.id, record.programingstatus)}
          >
            <DeleteOutlined /> {t("Delete")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles["language-list"]}>
      <div className={styles["actions-container"]}>
        <Input
          placeholder={t("Search by Name")}
          value={searchName}
          onChange={(e) => handleNameFilter(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/AddLanguage")}
        >
          {t("Add Programming Language")}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ current: currentPage, pageSize: pageSize }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ViewLanguage;
