// PositionSkeleton.jsx
import React from "react";
import { Skeleton, Space, Table } from "antd";

const PositionSkeleton = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: () => <Skeleton.Input style={{ width: 100 }} active />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: () => <Skeleton.Input style={{ width: 200 }} active />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <Skeleton.Input style={{ width: 100 }} active />,
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Skeleton.Button active size="small" shape="round" />
          <Skeleton.Button active size="small" shape="round" />
        </Space>
      ),
    },
  ];

  const data = Array.from({ length: 6 }, (_, index) => ({
    key: index,
    name: "",
    description: "",
    status: "",
    actions: "",
  }));

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default PositionSkeleton;
