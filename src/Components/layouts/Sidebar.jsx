import React, { useState } from "react";
import "../../styles/layouts/Sidebar.css";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Flex, Layout } from 'antd';
const { Sider, Content } = Layout;
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import Main from "./Main";
import index from "../User";
import Create from "../Employee/Employee_Information/CreateEmployee";


const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  height: '100%',
  color: '#fff',

  
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',

};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  height: '100vh',
  width: 'calc(100% - 8px)',
  maxWidth: 'calc(100% - 8px)',
};

const items = [
  {
    key: 'sub1',
    icon: <PieChartOutlined />,
    label: 'Manage Accounts',
    children: [
      {
        key: '1',
        label: <Link to="../Employee/Employee_Information/CreateEmployee">Account Info</Link>
      },
      {
        key: '2',
        label: <Link to="/../Employee/EmployeeList">Reset Password</Link>,
      },
    ],
  },
  {
    key: 'sub2',
    icon: <DesktopOutlined />,
    label: 'Manage Projects',
    children: [
      {
        key: '3',
        label: <Link to="/../Employee/EmployeeList">Project Info</Link>,
      },
      {
        key: '4',
        label: <Link to="/../Employee/EmployeeList">Assign Employees</Link>,
      },
      {
        key: '5',
        label: <Link to="/../Employee/EmployeeList">Project Tracking</Link>,
      }
    ],
  },
  {
    key: 'sub3',
    icon: <ContainerOutlined />,
    label: 'Technology',
    children: [
      {
        key: '6',
        label: <Link to="/../Employee/EmployeeList">Technology Info</Link>,
      },
    ],
  },
  {
    key: 'sub4',
    label: 'Employee',
    icon: <MailOutlined />,
    children: [
      {
        key: '7',
        label: <Link to="/../Employee/EmployeeDetails">Employee Profile</Link>,
      },
      {
        key: '8',
        label: <Link to="/../Employee/EmployeeList">Assign Project</Link>,
      },
    ],
  },
  {
    key: 'sub5',
    label: 'Languages',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '9',
        label: <Link to="/../Employee/EmployeeList">Programming Language Info</Link>,
      },
    ],
  },
  {
    key: '10',
    icon: <ContainerOutlined />,
    label: 'Translate',
    children: [
      {
        key: '7',
        label: <Link to="/../Employee/EmployeeList">Vietnamese</Link>,
      },
      {
        key: '8',
        label: <Link to="/../Employee/EmployeeList">English</Link>,
      },
    ],
  },
  {
    key: '11',
    icon: <ContainerOutlined />,
    label: <Link to="/../Employee/EmployeeList">CV</Link>,
  },
];



const SidebarItem = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  };

  return (
    <div className="sidebar-item">
      <div className="sidebar-item-title" onClick={toggleExpand}>
        {title}
      </div>
      <div className={`sidebar-sub-items ${isExpanded ? "expanded" : ""}`}>
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
        <Flex gap="middle" wrap>

    <Layout style={layoutStyle}>

      <Layout>
        <Sider width="20%" style={siderStyle}>          
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
        </Sider>
        <Content style={contentStyle}><Main></Main></Content>
      </Layout>
    </Layout>
        </Flex>

</>
  );
};

export default Sidebar;
