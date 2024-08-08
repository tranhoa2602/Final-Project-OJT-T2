import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, message, Skeleton } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { RedoOutlined, DeleteOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TechBin = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await axios.get(
          `${firebaseConfig.databaseURL}/technologies.json`
        );
        const result = response.data;
        const techList = [];

        for (const key in result) {
          techList.push({ id: key, ...result[key] });
        }

        setData(techList.filter((item) => item.deletestatus === true));
      } catch (error) {
        console.error("Error fetching technologies:", error);
        message.error(t("Failed to fetch technologies."));
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [t]);

  const handleRestore = async (id) => {
    try {
      await axios.patch(
        `${firebaseConfig.databaseURL}/technologies/${id}.json`,
        { deletestatus: false }
      );
      message.success(t("Technology restored successfully!"));
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error restoring technology:", error);
      message.error(t("Failed to restore technology."));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${firebaseConfig.databaseURL}/technologies/${id}.json`
      );
      message.success(t("Technology permanently deleted!"));
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting technology:", error);
      message.error(t("Failed to delete technology."));
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "techname",
      key: "techname",
    },
    {
      title: t("Type"),
      dataIndex: "techtype",
      key: "techtype",
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
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {t(status === "Active" ? "Active" : "Inactive")}
        </Tag>
      ),
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
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleRestore(record.id)}>
            <RedoOutlined /> {t("Restore")}
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            <DeleteOutlined /> {t("Delete")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16, marginTop: 16 }}
        onClick={() => navigate("/TechList")}
      >
        {t("Back to Tech List")}
      </Button>
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
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

export default TechBin;
