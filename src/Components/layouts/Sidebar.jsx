import React, { useEffect, useState } from "react";
import "../../styles/layouts/Sidebar.css";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Flex, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { Button, Menu } from 'antd';
import Main from "./Main";

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  height: '100%',
  color: '#fff',
  backgroundColor: '#0958d9',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
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
        label: 'Account Info',
      },
      {
        key: '2',
        label: 'Reset Password',
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
        label: 'Project Info',
      },
      {
        key: '4',
        label: 'Assign Employees',
      },
      {
        key: '5',
        label: 'Project Tracking',
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
        label: 'Technology Info',
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
        label: 'Employee Profile',
      },
      {
        key: '8',
        label: 'Assign Project',
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
        label: 'Programming Language Info',
      },
    ],
  },
  {
    key: '10',
    icon: <ContainerOutlined />,
    label: 'CV',
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
      <Header style={headerStyle}>Header</Header>
      <Layout>
        <Sider width="20%" style={siderStyle}>          
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
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
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
        </Flex>

</>

/*
      <div className="sidebar-desktop">
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={toggleSidebar}>
            &times;
          </button>
          <h2>Adim Page</h2>
          <ul>
            <SidebarItem title="Manage Accounts">
              <li>Account Info</li>
              <li>Reset Password</li>
            </SidebarItem>
            <SidebarItem title="Manage Projects">
              <li>Project Info</li>
              <li>Assign Employees</li>
              <li>Project Tracking</li>
            </SidebarItem>
            <SidebarItem title="Technology">
              <li>Technology Info</li>
            </SidebarItem>
            <SidebarItem title="Employee">
              <li>Employee Profile</li>
              <li>Assign Project</li>
            </SidebarItem>
            <SidebarItem title="Languages">
              <li>Programming Language Info</li>
            </SidebarItem>
            <SidebarItem title="CV"></SidebarItem>
            <SidebarItem title="Log out"></SidebarItem>
          </ul>
        </div>
      </div> 
    </> */
  );
};

export default Sidebar;
