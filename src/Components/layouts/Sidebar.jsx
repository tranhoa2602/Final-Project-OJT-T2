import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n"; // Đảm bảo đường dẫn này đúng
import "../../styles/layouts/Sidebar.scss";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  SolutionOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const siderStyle = {
  textAlign: "left",
  color: "#fff",
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  height: "100vh",
  width: "calc(100% - 8px)",
  maxWidth: "calc(100% - 8px)",
};

const buttonStyle = {
  position: "absolute",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  width: "90%",
};

const Sidebar = () => {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState(null);
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserRole(storedUser.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const items = [
    userRole === "Admin" && {
      key: "sub1",
      icon: <UserOutlined />,
      label: t("Manage Accounts"),
      children: [
        {
          key: "1",
          label: <Link to="/admin">{t("Account Info")}</Link>,
        },
        {
          key: "2",
          label: <Link to="/change-password">{t("Reset Password")}</Link>,
        },
      ],
    },
    {
      key: "sub2",
      icon: <FundProjectionScreenOutlined />,
      label: t("Manage Projects"),
      children: [
        {
          key: "3",
          label: (
            <Link to="/../Employee/EmployeeList">{t("Project Info")}</Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link to="/../Employee/EmployeeList">{t("Assign Employees")}</Link>
          ),
        },
        {
          key: "5",
          label: (
            <Link to="/../Employee/EmployeeList">{t("Project Tracking")}</Link>
          ),
        },
      ],
    },
    {
      key: "sub3",
      icon: <DeploymentUnitOutlined />,
      label: t("Technology"),
      children: [
        {
          key: "6",
          label: <Link to="/TechList">{t("Technology Info")}</Link>,
        },
      ],
    },
    {
      key: "sub4",
      label: t("Employee"),
      icon: <TeamOutlined />,
      children: [
        {
          key: "7",
          label: <Link to="create-user">{t("Employee Profile")}</Link>,
        },
        {
          key: "8",
          label: (
            <Link to="/../Employee/EmployeeList">{t("Assign Project")}</Link>
          ),
        },
      ],
    },
    {
      key: "sub5",
      label: t("Languages"),
      icon: <GlobalOutlined />,
      children: [
        {
          key: "9",
          label: (
            <Link to="/ViewLanguage">{t("Programming Language Info")}</Link>
          ),
        },
      ],
    },
    {
      key: "10",
      icon: <SolutionOutlined />,
      label: <Link to="/../Employee/EmployeeList">{t("CV")}</Link>,
    },
    {
      key: "11",
      icon: <LogoutOutlined />,
      label: (
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {t("Logout")}
        </button>
      ),
    },
  ].filter(Boolean); // Filter out any falsy values (e.g., undefined) from the items array

  return (
    <Layout style={layoutStyle}>
      <Sider width="15%" style={siderStyle}>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          items={items}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        />
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <Button
            onClick={() => changeLanguage("vi")}
            style={{ marginRight: 10 }}
          >
            {t("Vietnamese")}
          </Button>
          <Button onClick={() => changeLanguage("en")}>{t("English")}</Button>
        </div>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
