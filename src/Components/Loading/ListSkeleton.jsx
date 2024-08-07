import React from "react";
import { Skeleton, Space, Table } from "antd";

const ListSkeleton = () => {
  const columns = [
    {
      title: "Profile Picture",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: () => <Skeleton.Avatar active size={64} shape="circle" />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: () => (
        <Skeleton.Input active size="default" style={{ width: 120 }} />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: () => (
        <Skeleton.Input active size="default" style={{ width: 200 }} />
      ),
    },
    {
      title: "Position",
      dataIndex: "positionName",
      key: "positionName",
      render: () => (
        <Skeleton.Input active size="default" style={{ width: 150 }} />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => (
        <Skeleton.Input active size="default" style={{ width: 100 }} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Skeleton.Button active size="small" shape="round" />
          <Skeleton.Button active size="small" shape="round" />
          <Skeleton.Button active size="small" shape="round" />
        </Space>
      ),
    },
  ];

  // Ensure unique keys
  const data = Array(6)
    .fill(null)
    .map((_, index) => ({ key: `skeleton-${index}` }));

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default ListSkeleton;
