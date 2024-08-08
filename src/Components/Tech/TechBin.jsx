import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import { RedoOutlined, DeleteOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { getDatabase, ref, get, update, set } from "firebase/database";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const TechBin = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
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

        setData(techList.filter(item => item.deletestatus === true));
      } catch (error) {
        console.error("Error fetching technologies:", error);
        message.error(t("Failed to fetch technologies."));
      }
    };

    fetchData();
  }, [t]);

  const handleRestore = async (id) => {
    try {
      const db = getDatabase();
      
      // Get user information from local storage
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        throw new Error("User information is missing in local storage.");
      }
      
      // Convert user data from JSON to object
      const user = JSON.parse(storedUser);
      const userKey = user.key;
      
      if (!userKey) {
        throw new Error("User key is missing in local storage.");
      }
      
      // Fetch user data from Firebase
      const userRef = ref(db, `users/${userKey}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        throw new Error("User not found.");
      }
      
      const userName = userSnapshot.val().name || 'Unknown'; // Use name from user object
      
      // Fetch technology data from Firebase
      const techRef = ref(db, `technologies/${id}`);
      const techSnapshot = await get(techRef);
      
      if (!techSnapshot.exists()) {
        throw new Error("Technology not found.");
      }
      
      const techName = techSnapshot.val().techname;
      
      // Restore technology's delete status
      await update(techRef, { deletestatus: false });
      
      // Log restore action to history
      await set(ref(db, `techhistory/${new Date().toISOString().replace(/[.:]/g, "_")}`), {
        techname: techName,
        user: userName, // Use name from user object
        action: "Restore",
        timestamp: new Date().toISOString(),
      });
      
      message.success("Technology restored successfully!");
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error restoring technology:", error.message);
      message.error(`Failed to restore technology: ${error.message}`);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      // Get user information from local storage
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        throw new Error("User information is missing in local storage.");
      }
      
      // Convert user data from JSON to object
      const user = JSON.parse(storedUser);
      const userKey = user.key;
      
      if (!userKey) {
        throw new Error("User key is missing in local storage.");
      }
      
      const db = getDatabase();
      
      // Fetch user data from Firebase
      const userRef = ref(db, `users/${userKey}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        throw new Error("User not found.");
      }
      
      const userName = userSnapshot.val().name || 'Unknown'; // Use name from user object
      
      // Fetch technology data from Firebase
      const techRef = ref(db, `technologies/${id}`);
      const techSnapshot = await get(techRef);
      
      if (!techSnapshot.exists()) {
        throw new Error("Technology not found.");
      }
      
      const techName = techSnapshot.val().techname;
      
      // Log delete action to history
      await set(ref(db, `techhistory/${new Date().toISOString().replace(/[.:]/g, "_")}`), {
        techname: techName,
        user: userName, // Use name from user object
        action: "Delete",
        timestamp: new Date().toISOString(),
      });
      
      // Permanently delete the technology
      const deleteResponse = await axios.delete(
        `${firebaseConfig.databaseURL}/technologies/${id}.json`
      );
      
      if (deleteResponse.status === 200) {
        message.success(t("Technology permanently deleted!"));
        
        // Update UI
        setData(prevData => prevData.filter(item => item.id !== id));
      } else {
        throw new Error(`Failed to delete technology. Status code: ${deleteResponse.status}`);
      }
    } catch (error) {
      console.error("Error deleting technology:", error.message);
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
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
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
          <Button
            type="primary"
            onClick={() => handleRestore(record.id)}
          >
            <RedoOutlined /> {t("Restore")}
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.id)}
          >
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
        onClick={() => navigate("/TechList")}
      >
        {t("Back to Tech List")}
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ current: currentPage, pageSize: 3 }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default TechBin;
