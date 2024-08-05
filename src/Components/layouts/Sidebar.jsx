import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import {
  UserOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  SolutionOutlined,
  DeploymentUnitOutlined,
  LogoutOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Switch, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FaFlagUsa, FaFlag } from "react-icons/fa";
import logo from "../../assets/logo.png"; // Đường dẫn tới logo của bạn

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
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  height: "100vh",
  width: "calc(100% - 8px)",
  maxWidth: "calc(100% - 8px)",
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
          label: <Link to="/change-password">{t("Change Password")}</Link>,
        },
      ],
    },
    userRole === "Employee" && {
      key: "sub2",
      icon: <UserOutlined />,
      label: <Link to="/profile">{t("Profile")}</Link>,
      children: [
        {
          key: "change-password",
          label: <Link to="/change-password">{t("Change Password")}</Link>,
        },
      ],
    },
    {
      key: "sub3",
      icon: <FundProjectionScreenOutlined />,
      label: t("Manage Projects"),
      children: [
        {
          key: "3",
          label: <Link to="/projects">{t("Projects list")}</Link>,
        },
      ],
    },
    {
      key: "10",
      icon: <SolutionOutlined />,
      label: <Link to="/ListPosition">{t("Position")}</Link>,
    },
    {
      key: "sub4",
      icon: <DeploymentUnitOutlined />,
      label: <Link to="/TechList">{t("Technology")}</Link>,
    },
    userRole === "Admin" && {
      key: "sub5",
      label: <Link to="/list">{t("Employee List")}</Link>,
      icon: <TeamOutlined />,
    },
    {
      key: "sub6",
      label: <Link to="/ViewLanguage">{t("Programming Language")}</Link>,
      icon: <GlobalOutlined />,
    },
  ].filter(Boolean); // Filter out any falsy values (e.g., undefined) from the items array

  return (
    <Layout style={layoutStyle}>
      <Sider
        width="15%"
        style={siderStyle}
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
                width: collapsed ? "60%" : "45%",
                margin: "10px",
                borderRadius: "100px",
              }}
            />
          </div>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
            items={items}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
          />
        </div>
        <div>
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <Switch
              checkedChildren={
                <>
                  <FaFlag style={{ marginRight: 5 }} />
                  {t("Vietnamese")}
                </>
              }
              unCheckedChildren={
                <>
                  <FaFlagUsa style={{ marginRight: 5 }} />
                  {t("English")}
                </>
              }
              onChange={changeLanguage}
              checked={language === "vi"}
            />
          </div>
          <div style={{ textAlign: "center", padding: "5px" }}>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                color: "#fff",
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
                width: "80%",
                margin: "10px auto",
              }}
            >
              {t("Logout")}
            </Button>
          </div>
        </div>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
