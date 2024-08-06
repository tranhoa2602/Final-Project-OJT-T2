import React from "react";
import { Skeleton, Table, Space } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: () => <Skeleton.Input style={{ width: 100 }} active />,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: () => <Skeleton.Input style={{ width: 150 }} active />,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: () => <Skeleton.Input style={{ width: 100 }} active />,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: () => <Skeleton.Input style={{ width: 200 }} active />,
  },
  {
    title: "Images",
    dataIndex: "images",
    key: "images",
    render: () => (
      <Space>
        <Skeleton.Image style={{ width: 100, height: 100 }} />
        <Skeleton.Image style={{ width: 100, height: 100 }} />
      </Space>
    ),
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: () => (
      <Space>
        <Skeleton.Button active />
        <Skeleton.Button active />
      </Space>
    ),
  },
];

const data = Array.from({ length: 3 }, (_, index) => ({
  key: index,
  name: "",
  type: "",
  status: "",
  description: "",
  images: "",
  actions: "",
}));

function ListTech() {
  return <Table columns={columns} dataSource={data} pagination={false} />;
}

export default ListTech;
