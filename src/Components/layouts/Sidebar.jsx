import React, { useState } from "react";
import "../../styles/layouts/Sidebar.css";
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
import { Layout, Menu } from "antd";
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

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const items = [
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Manage Accounts",
      children: [
        {
          key: "1",
          label: <Link to="/admin">Account Info</Link>,
        },
        {
          key: "2",
          label: <Link to="/../Employee/EmployeeList">Reset Password</Link>,
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
          label: <Link to="/../Employee/EmployeeList">Project Info</Link>,
        },
        {
          key: "4",
          label: <Link to="/../Employee/EmployeeList">Assign Employees</Link>,
        },
        {
          key: "5",
          label: <Link to="/../Employee/EmployeeList">Project Tracking</Link>,
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
          label: <Link to="/../Employee/EmployeeList">Technology Info</Link>,
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
          label: <Link to="create-user">Employee Profile</Link>,
        },
        {
          key: "8",
          label: <Link to="/../Employee/EmployeeList">Assign Project</Link>,
        },
      ],
    },
    {
      key: "sub5",
      label: "Languages",
      icon: <GlobalOutlined />,
      children: [
        {
          key: "9",
          label: (
            <Link to="/../Employee/EmployeeList">
              Programming Language Info
            </Link>
          ),
        },
      ],
    },
    {
      key: "sub6",
      icon: <GlobalOutlined />,
      label: "Translate",
      children: [
        {
          key: "10",
          label: <Link to="/../Employee/EmployeeList">Vietnamese</Link>,
        },
        {
          key: "11",
          label: <Link to="/../Employee/EmployeeList">English</Link>,
        },
      ],
    },
    {
      key: "12",
      icon: <SolutionOutlined />,
      label: <Link to="/../Employee/EmployeeList">CV</Link>,
    },
    {
      key: "13",
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
  ];

  return (
    <Layout style={layoutStyle}>
      <Sider width="15%" style={siderStyle} collapsible collapsed={collapsed}>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          items={items}
        />
      </Sider>
    </Layout>
  );
};

export default Sidebar;
