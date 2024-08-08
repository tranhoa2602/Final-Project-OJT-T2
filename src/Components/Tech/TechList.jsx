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
import { getDatabase, ref, get, update, set } from "firebase/database";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import TechListSkeleton from "../Loading/ListTech"; // Import the TechListSkeleton component
import "../../styles/layouts/tablestyles.css";

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
  const [loading, setLoading] = useState(true); // Add loading state

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
        setFilteredData(techList.filter((item) => item.deletestatus === false));
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching technologies: ", error);
        message.error(t("Failed to fetch technologies."));
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    // Simulate a delay to show the skeleton
    const timer = setTimeout(() => {
      fetchData();
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, [t]);

  useEffect(() => {
    const filterData = () => {
      let filtered = data.filter((item) => item.deletestatus === false);

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

  const getVietnamTime = () => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const parts = formatter.formatToParts(new Date());
    const day = parts.find((part) => part.type === "day").value;
    const month = parts.find((part) => part.type === "month").value;
    const year = parts.find((part) => part.type === "year").value;
    const hour = parts.find((part) => part.type === "hour").value;
    const minute = parts.find((part) => part.type === "minute").value;
    const second = parts.find((part) => part.type === "second").value;

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const handleDelete = (id, status) => {
    if (status === "Active") {
      message.error(
        t("The technology is in Active status and cannot be deleted.")
      );
      return;
    }

    Modal.confirm({
      title: t("Are you sure you want to move this technology to the bin?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        try {
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            throw new Error("User information is missing in local storage.");
          }

          const user = JSON.parse(storedUser);
          const userKey = user.key;

          if (!userKey) {
            throw new Error("User key is missing in local storage.");
          }

          const db = getDatabase();
          const userRef = ref(db, `users/${userKey}`);
          const userSnapshot = await get(userRef);

          if (!userSnapshot.exists()) {
            throw new Error("User not found.");
          }

          const userName = userSnapshot.val().name || "Unknown";
          const techRef = ref(db, `technologies/${id}`);
          const techSnapshot = await get(techRef);

          if (!techSnapshot.exists()) {
            throw new Error("Technology not found.");
          }

          const techName = techSnapshot.val().techname;
          await update(techRef, { deletestatus: true });

          const formattedTimestamp = getVietnamTime();
          await set(
            ref(db, `techhistory/${formattedTimestamp.replace(/[/: ]/g, "_")}`),
            {
              techname: techName,
              user: userName,
              action: "Move to Bin",
              timestamp: formattedTimestamp,
            }
          );

          message.success(t("Technology moved to bin successfully!"));
          setData((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, deletestatus: true } : item
            )
          );
          setFilteredData((prevFilteredData) =>
            prevFilteredData.filter((item) => item.id !== id)
          );
        } catch (error) {
          console.error("Error handling delete action: ", error.message);
          message.error(
            t(`Failed to move technology to bin: ${error.message}`)
          );
        }
      },
    });
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
      align: "center",
      className: "type-tags",
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
      align: "center",
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
        <Tag color={status === "Active" ? "green" : "red"}>
          {t(status === "Active" ? "Active" : "Inactive")}
        </Tag>
      ),
    },
    {
      title: t("Description"),
      dataIndex: "techdescription",
      key: "techdescription",
      className: "truncate-text",
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
      className: "action-table",
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
            onClick={() => handleDelete(record.id, record.techstatus)} // Truyền status vào đây
          >
            <DeleteOutlined /> {t("Move to Bin")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Skeleton.Button active size="large" style={{ width: 200 }} />
            <Skeleton.Button active size="large" style={{ width: 200 }} />
          </Space>
          <TechListSkeleton />
        </>
      ) : (
        <div style={{ marginTop: "20px" }}>
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
            style={{
              backgroundColor: "green",
              color: "white",
              marginBottom: 16,
              marginLeft: "20px",
            }}
            onClick={() => navigate("/techBin")}
          >
            {t("View Bin")}
          </Button>
          <Button
            type="primary"
            icon={<HistoryOutlined />}
            style={{
              backgroundColor: "green",
              color: "white",
              marginBottom: 16,
              marginLeft: "20px",
            }}
            onClick={() => navigate("/techHistory")}
          >
            {t("View History")}
          </Button>
          <h1 className="title">{t("LIST OF TECHNOLOGY")}</h1>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ current: currentPage, pageSize: 3 }}
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
        </div>
      )}
    </>
  );
};

export default TechList;
