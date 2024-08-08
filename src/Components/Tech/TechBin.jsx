import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, message, Skeleton, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { RedoOutlined, DeleteOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getDatabase, ref, get, set } from "firebase/database";

const TechBin = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Define fetchData function
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

  useEffect(() => {
    fetchData();
  }, [t]);

  const getVietnamTime = () => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    
    const parts = formatter.formatToParts(new Date());
    const day = parts.find(part => part.type === 'day').value;
    const month = parts.find(part => part.type === 'month').value;
    const year = parts.find(part => part.type === 'year').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;
    const second = parts.find(part => part.type === 'second').value;
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const handleRestore = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to restore this technology?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        try {
          const storedUser = localStorage.getItem('user');
          
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
          
          const userName = userSnapshot.val().name || 'Unknown'; 
          
          const techRef = ref(db, `technologies/${id}`);
          const techSnapshot = await get(techRef);
          
          if (!techSnapshot.exists()) {
            throw new Error("Technology not found.");
          }
          
          const techName = techSnapshot.val().techname;
          
          const formattedTimestamp = getVietnamTime();
          
          await set(ref(db, `techhistory/${formattedTimestamp.replace(/[/: ]/g, "_")}`), {
            techname: techName,
            user: userName,
            action: "Restored from Bin",
            timestamp: formattedTimestamp,
          });
          
          await axios.patch(
            `${firebaseConfig.databaseURL}/technologies/${id}.json`,
            { deletestatus: false }
          );
          
          message.success(t("Technology restored successfully!"));
          await fetchData(); // Refresh the list
        } catch (error) {
          console.error("Error restoring technology:", error.message);
          message.error(t(`Failed to restore technology: ${error.message}`));
        }
      },
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: t("Are you sure you want to permanently delete this technology?"),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk: async () => {
        try {
          const storedUser = localStorage.getItem('user');
          
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
          
          const userName = userSnapshot.val().name || 'Unknown'; 
          
          const techRef = ref(db, `technologies/${id}`);
          const techSnapshot = await get(techRef);
          
          if (!techSnapshot.exists()) {
            throw new Error("Technology not found.");
          }
          
          const techName = techSnapshot.val().techname;
          
          const formattedTimestamp = getVietnamTime();
          
          await set(ref(db, `techhistory/${formattedTimestamp.replace(/[/: ]/g, "_")}`), {
            techname: techName,
            user: userName,
            action: "Permanently Deleted",
            timestamp: formattedTimestamp,
          });
          
          await axios.delete(`${firebaseConfig.databaseURL}/technologies/${id}.json`);
          message.success(t("Technology permanently deleted!"));
          setData(data.filter((item) => item.id !== id));
        } catch (error) {
          console.error("Error deleting technology:", error.message);
          message.error(t(`Failed to delete technology: ${error.message}`));
        }
      },
    });
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
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/techlist")}
      >
        {t("Back to List")}
      </Button>

      <h1 className="title">{t("TECHNOLOGY BIN")}</h1>

      {loading ? (
        <Skeleton active />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: currentPage,
            pageSize,
            total: data.length,
          }}
          onChange={handleTableChange}
          rowKey="id"
        />
      )}
    </div>
  );
};

export default TechBin;
