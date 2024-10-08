import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import {
  UserOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  HomeOutlined,
  SolutionOutlined,
  DeploymentUnitOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../styles/layouts/Sidebar.scss";

const { Sider } = Layout;

const siderStyle = {
  textAlign: "left",
  color: "#fff",
  height: "100vh", // Ensure full height
  position: "fixed",
  left: 0,
  top: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "#000", // Set sidebar background to black
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  height: "100vh",
};

const Sidebar = () => {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState(null);
  const [openKeys, setOpenKeys] = useState([]);
  const [language, setLanguage] = useState(i18n.language); // Quản lý ngôn ngữ hiện tại
  const [collapsed, setCollapsed] = useState(false);
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

  const changeLanguage = () => {
    const newLanguage = language === "en" ? "vi" : "en";
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    userRole === "Admin" && {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">{t("Dashboard")}</Link>,
    },
    userRole === "Admin" && {
      key: "sub1_manage",
      icon: <UserOutlined />,
      label: t("Admin Page"),
      children: [
        {
          key: "2",
          label: <Link to="/admin">{t("Admin Profile")}</Link>,
        },
        {
          key: "3",
          label: <Link to="/change-password">{t("Change Password")}</Link>,
        },
      ],
    },
    userRole === "Employee" && {
      key: "sub2_profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">{t("Profile")}</Link>,
      children: [
        {
          key: "4",
          label: <Link to="/change-password">{t("Change Password")}</Link>,
        },
      ],
    },
    {
      key: "sub3_projects",
      icon: <FundProjectionScreenOutlined />,
      label: t("Manage Projects"),
      children: [
        {
          key: "5",
          label: <Link to="/projects">{t("Projects list")}</Link>,
        },
      ],
    },
    {
      key: "6",
      icon: <SolutionOutlined />,
      label: <Link to="/listPosition">{t("Position")}</Link>,
    },
    {
      key: "sub4_technology",
      icon: <DeploymentUnitOutlined />,
      label: <Link to="/techList">{t("Technology")}</Link>,
    },
    userRole === "Admin" && {
      key: "7",
      label: <Link to="/list">{t("Employee List")}</Link>,
      icon: <TeamOutlined />,
    },
    {
      key: "8",
      label: <Link to="/viewLanguage">{t("Programming Language")}</Link>,
      icon: <GlobalOutlined />,
    },
  ].filter(Boolean); // Filter out any falsy values (e.g., undefined) from the items array

  return (
    <Layout style={{ height: "100vh", maxWidth: "100%" }}>
      <Sider
        width="15%"
        style={{
          textAlign: "left",
          color: "#fff",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000",
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapse}
      >
        <div>
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                width: collapsed ? "50%" : "60%",
              }}
            />
          </div>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1_manage"]}
            mode="inline"
            theme="dark"
            items={items}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{ backgroundColor: "#000" }}
          />
        </div>
        <div>
          <div style={{ textAlign: "center", padding: "10px" }}>
            <div className="flag-switch" data-first-lang="" data-second-lang="">
              <input
                type="checkbox"
                id="check1"
                checked={language === "vi"}
                onChange={changeLanguage}
              />
              <label htmlFor="check1"></label>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "5px" }}>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                color: "#000",
                backgroundImage: "linear-gradient(to right, #ffffff, #87CEEB)",
                width: collapsed ? "40px" : "80%",
                margin: "10px auto",
              }}
            >
              {!collapsed && t("Logout")}
            </Button>
          </div>
        </div>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
