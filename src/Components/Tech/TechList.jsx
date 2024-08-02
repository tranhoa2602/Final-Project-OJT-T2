import React, { useEffect, useState } from "react";
import { Space, Table, Button, Tag, message, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const { Option } = Select;

const TechList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

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
        setFilteredData(techList.filter(item => item.deletestatus === false));
      } catch (error) {
        console.error("Error fetching technologies: ", error);
        message.error(t("Failed to fetch technologies."));
      }
    };

    fetchData();
  }, [t]);

  useEffect(() => {
    const filterData = () => {
      let filtered = data.filter(item => item.deletestatus === false);

      if (searchName) {
        filtered = filtered.filter((item) =>
          item.techname.toLowerCase().includes(searchName.toLowerCase())
        );
      }

      if (searchType) {
        filtered = filtered.filter((item) =>
          item.techtype.some((type) =>
            type.toLowerCase().includes(searchType.toLowerCase())
          )
        );
      }

      if (searchStatus) {
        filtered = filtered.filter(
          (item) => item.techstatus.toLowerCase() === searchStatus.toLowerCase()
        );
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [searchName, searchType, searchStatus, data]);

  const handleDelete = async (id) => {
    try {
      await axios.patch(
        `${firebaseConfig.databaseURL}/technologies/${id}.json`,
        { deletestatus: true }
      );
      message.success(t("Technology moved to bin successfully!"));
      setData(data.map(item => item.id === id ? { ...item, deletestatus: true } : item));
      setFilteredData(filteredData.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error updating deletestatus: ", error);
      message.error(t("Failed to move technology to bin."));
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
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "techname",
      key: "techname",
      filterDropdown: () => (
        <div className="filter-dropdown">
          <Input
            placeholder={t("Search by Name")}
            value={searchName}
            onChange={(e) => handleNameFilter(e.target.value)}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      onFilter: (value, record) =>
        record.techname.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: t("Type"),
      dataIndex: "techtype",
      key: "techtype",
      filterDropdown: () => (
        <div className="filter-dropdown">
          <Input
            placeholder={t("Search by Type")}
            value={searchType}
            onChange={(e) => handleTypeFilter(e.target.value)}
            style={{ marginBottom: 8, display: "block" }}
          />
        </div>
      ),
      onFilter: (value, record) =>
        record.techtype.some((type) =>
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
      dataIndex: "techstatus",
      key: "techstatus",
      filterDropdown: () => (
        <div className="filter-dropdown">
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
        record.techstatus.toLowerCase().includes(value.toLowerCase()),
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: t("Description"),
      dataIndex: "techdescription",
      key: "techdescription",
    },
    {
      title: t("Images"),
      dataIndex: "imageUrls",
      key: "imageUrls",
      render: (imageUrls) => (
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          style={{ width: "100px", height: "100px" }}
        >
          {imageUrls && imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  src={url}
                  alt={`Tech Image ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            ))
          ) : (
            <div>{t("No images available")}</div>
          )}
        </Swiper>
      ),
    },
    {
      title: t("Actions"),
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/EditTech/${record.id}`)}
          >
            <EditOutlined /> {t("Edit")}
          </Button>
          <Button
            type="primary"
            danger
            disabled={record.techstatus === "Active"}
            onClick={() => handleDelete(record.id)}
          >
            <DeleteOutlined /> {t("Move to Bin")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/AddTech")}
      >
        {t("Add Technology")}
      </Button>
      <Button
        type="primary"
        icon={<DeleteOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/TechBin")}
      >
        {t("View Bin")}
      </Button>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ current: currentPage, pageSize: 3 }} // Set pageSize to 3
        onChange={handleTableChange}
      />
    </>
  );
};

export default TechList;
