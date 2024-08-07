import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Button,
  Tag,
  message,
  Input,
  Select,
  Skeleton,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "../../styles/layouts/ViewLanguage.module.scss";
import LanguageSkeleton from "../Loading/ListProgram"; // Import the skeleton component
import "../../styles/layouts/tablestyles.css"

const { Option } = Select;

const ViewLanguage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
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
        setFilteredData(
          languages.filter((item) => item.deletestatus === false)
        );
      } catch (error) {
        console.error("Error fetching Programming Languages: ", error);
        message.error(t("Failed to fetch Programming Languages."));
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000); // Set timeout for 2 seconds
      }
    };

    fetchData();

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(fetchData);
  }, [t]);

  useEffect(() => {
    const filterData = () => {
      let filtered = data.filter((item) => item.deletestatus === false);

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

  const handleDelete = (id, status) => {
    if (status === "Active") {
      message.error(t("Language is in Active status and cannot be deleted."));
      return;
    }
    Modal.confirm({
      title: t("Are you sure you want to delete this programming language?"),
      content: t("This action cannot be undone."),
      okText: t("Yes"),
      okType: "danger",
      cancelText: t("No"),
      onOk: async () => {
        try {
          await axios.patch(
            `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`,
            { deletestatus: true }
          );
          message.success(t("Programming Language moved to bin successfully!"));
          setData(
            data.map((item) =>
              item.id === id ? { ...item, deletestatus: true } : item
            )
          );
          setFilteredData(filteredData.filter((item) => item.id !== id));
        } catch (error) {
          console.error("Error updating deletestatus: ", error);
          message.error(t("Failed to move Programming Language to bin."));
        }
      },
    });
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`,
        { deletestatus: false }
      );
      message.success(t("Programming Language restored successfully!"));
      setData(
        data.map((item) =>
          item.id === id ? { ...item, deletestatus: false } : item
        )
      );
      setFilteredData(filteredData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error restoring Programming Language: ", error);
      message.error(t("Failed to restore Programming Language."));
    }
  };

  const handleDeletePermanently = async (id) => {
    try {
      await axios.delete(
        `${firebaseConfig.databaseURL}/programmingLanguages/${id}.json`
      );
      message.success(t("Programming Language deleted permanently!"));
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
      align: "center",
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
      align: "center",
      className: "type-tags",
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
        <Tag color={status === "Active" ? "green" : "red"}>
          {t(status === "Active" ? "Active" : "Inactive")}
        </Tag>
      ),
    },
    {
      title: t("Description"),
      dataIndex: "programingdescription",
      key: "programingdescription",
      className: "truncate-text"
    },
    {
      title: t("Actions"),
      key: "action",
      align: "center",
      className: "action-table",
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
            onClick={() => handleDelete(record.id, record.programingstatus)}
          >
            <DeleteOutlined /> {t("Move to Bin")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles["language-list"]}>
      {loading ? (
        <Space className={styles["actions-container"]}>
          <Skeleton.Input style={{ width: 200 }} active />
          <Skeleton.Input style={{ width: 200 }} active />
          <Skeleton.Button style={{ width: 120 }} active />
          <Skeleton.Button style={{ width: 120 }} active />
        </Space>
      ) : (
        <div className={styles["actions-container"]}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/AddLanguage")}
          >
            {t("Add Programming Language")}
          </Button>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            style={{ backgroundColor: 'green', color: 'white', marginRight: '890px' }}
            onClick={() => navigate("/LanguageBin")}
          >
            {t("View Bin")}
          </Button>
        </div>
      )}
      <h1 className="title">{t("LIST OF PROGRAMMING LANGUAGES")}</h1>
      {loading ? (
        <LanguageSkeleton />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ current: currentPage, pageSize }}
          onChange={handleTableChange}
          components={{
            header: {
              cell: (props) => (
                <th {...props} className={`table-header ${props.className}`}>
                  {props.children}
                </th>
              ),
            },
          }}
        />
      )}
    </div>
  );
};

export default ViewLanguage;
