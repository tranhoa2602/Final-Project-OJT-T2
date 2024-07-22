import React from "react";
import { Space, Table, Tag, Button } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a> {text} </a>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a> Edit </a> <a> Delete </a>{" "}
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "Laravel",
    type: "Farmwork Web",
    status: "Active",
    description: "Basic, Easy to use",
  },
  {
    key: "2",
    name: "React JS",
    type: "Farmwork Web",
    status: "Active",
    description: "Front End Website Popular",
  },
  {
    key: "3",
    name: "TypeScript",
    type: "Farmwork Web",
    status: "Active",
    description: "New Farmwork Web ",
  },
];

const TechList = () => <Table columns={columns} dataSource={data} />;
export default TechList;
