import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; // Đảm bảo đường dẫn này đúng
import "../../styles/layouts/Sidebar.css";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Flex, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import Main from "./Main";

const { Sider, Content } = Layout;

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  height: "100%",
  color: "#fff",
};

const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
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
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const items = [
    {
      key: "sub1",
      icon: <PieChartOutlined />,
      label: t('Manage Accounts'),
      children: [
        {
          key: "1",
          label: (
            <Link to="../Employee/Employee_Information/CreateEmployee">
              {t('Account Info')}
            </Link>
          ),
        },
        {
          key: "2",
          label: <Link to="/../Employee/EmployeeList">{t('Reset Password')}</Link>,
        },
      ],
    },
    {
      key: "sub2",
      icon: <DesktopOutlined />,
      label: t('Manage Projects'),
      children: [
        {
          key: "3",
          label: <Link to="/../Employee/EmployeeList">{t('Project Info')}</Link>,
        },
        {
          key: "4",
          label: <Link to="/../Employee/EmployeeList">{t('Assign Employees')}</Link>,
        },
        {
          key: "5",
          label: <Link to="/../Employee/EmployeeList">{t('Project Tracking')}</Link>,
        },
      ],
    },
    {
      key: "sub3",
      icon: <ContainerOutlined />,
      label: t('Technology'),
      children: [
        {
          key: "6",
          label: <Link to="/../Employee/EmployeeList">{t('Technology Info')}</Link>,
        },
      ],
    },
    {
      key: "sub4",
      icon: <MailOutlined />,
      label: t('Employee'),
      children: [
        {
          key: "7",
          label: <Link to="/../Employee/EmployeeDetails">{t('Employee Profile')}</Link>,
        },
        {
          key: "8",
          label: <Link to="/../Employee/EmployeeList">{t('Assign Project')}</Link>,
        },
      ],
    },
    {
      key: "sub5",
      icon: <AppstoreOutlined />,
      label: t('Languages'),
      children: [
        {
          key: "9",
          label: (
            <Link to="/../Employee/EmployeeList">{t('Programming Language Info')}</Link>
          ),
        },
      ],
    },
    {
      key: 'sub6',
      icon: <ContainerOutlined />,
      label: t('Translate'),
      children: [
        {
          key: '10',
          label: (
            <div className="language-button" onClick={() => changeLanguage('vi')}>
              {t('Vietnamese')}
            </div>
          ),
        },
        {
          key: '11',
          label: (
            <div className="language-button" onClick={() => changeLanguage('en')}>
              {t('English')}
            </div>
          ),
        },
      ],
    },
    {
      key: "12",
      icon: <ContainerOutlined />,
      label: <Link to="/../Employee/EmployeeList">{t('CV')}</Link>,
    },
  ];

  return (
    <Flex gap="middle" wrap>
      <Layout style={layoutStyle}>
        <Sider
          width="20%"
          style={siderStyle}
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapsed}
        >
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
            items={items}
          />
        </Sider>
        <Content style={contentStyle}>
          <Main />
        </Content>
      </Layout>
    </Flex>
  );
};

export default Sidebar;
