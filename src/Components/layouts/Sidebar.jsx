import React, { useState, useEffect } from "react";
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);
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

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    userRole === "Admin" && {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Manage Accounts",
      children: [
        {
          key: "1",
          label: <Link to="/admin">Account Info</Link>,
        },
      ],
    },
    {
      key: "sub2",
      icon: <FundProjectionScreenOutlined />,
      label: "Manage Projects",
      children: [
        {
          key: "3",
          label: <Link to="/projects/info">Project Info</Link>,
        },
        {
          key: "4",
          label: <Link to="/projects/assign">Assign Employees</Link>,
        },
        {
          key: "5",
          label: <Link to="/projects/tracking">Project Tracking</Link>,
        },
      ],
    },
    {
      key: "sub3",
      icon: <DeploymentUnitOutlined />,
      label: "Technology",
      children: [
        {
          key: "6",
          label: <Link to="/tech-info">Technology Info</Link>,
        },
      ],
    },
    {
      key: "sub4",
      label: "Employee",
      icon: <TeamOutlined />,
      children: [
        {
          key: "7",
          label: <Link to="/create-user">Employee Profile</Link>,
        },
        {
          key: "8",
          label: <Link to="/employee/assign-project">Assign Project</Link>,
        },
      ],
    },
    {
      key: "sub5",
      label: "Programming Languages",
      icon: <GlobalOutlined />,
      children: [
        {
          key: "9",
          label: <Link to="/languages/info">Programming Language Info</Link>,
        },
      ],
    },
    {
      key: "10",
      icon: <SolutionOutlined />,
      label: <Link to="/cv">CV</Link>,
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
          Logout
        </button>
      ),
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
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          items={items}
        />
        <Button type="primary" onClick={toggleCollapse} style={buttonStyle}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
