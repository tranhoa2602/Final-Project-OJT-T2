import React from "react";
import { Space, Table, Tag, Button } from "antd";
import { exportToPDF } from "./ExportEmployeeList";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a href="user-details">{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Password",
    dataIndex: "password",
    key: "password",
  },
  {
    title: "Roles",
    key: "roles",
    dataIndex: "roles",
    render: (_, { roles }) => (
      <>
        {roles.map((role) => {
          let color = role.length > 5 ? "geekblue" : "green";
          if (role === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={role}>
              {role.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a href="/edit-user">Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    password: "",
    age: 32,
    email: "johnbrown@gmail.com",
    roles: ["employee"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    email: "jimgreen@gmail.com",
    roles: ["admin"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    email: "joeblack@gmail.com",
    roles: ["employee"],
  },
];
const EmployeeList = () => {
  return (
    <div>
      <Button type="primary" htmlType="button" style={{ marginBottom: 16 }}>
        Add Employee
      </Button>
      <Table columns={columns} dataSource={data} id="employee-table" />
      <Button
        type="primary"
        htmlType="button"
        onClick={() => exportToPDF("employee-table", "employee-list.pdf")}
        style={{ marginTop: 16 }}
      >
        Export to PDF
      </Button>
    </div>
  );
};
export default EmployeeList;


