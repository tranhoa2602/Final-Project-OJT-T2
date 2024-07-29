import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Tag, Switch } from "antd";
import { getDatabase, ref, set, update, remove, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

const ListPosition = () => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPositions = async () => {
      const db = getDatabase();
      const positionsRef = ref(db, "positions");
      const snapshot = await get(positionsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPositions(formattedData);
      } else {
        setPositions([]);
      }
    };

    fetchPositions();
  }, []);

  const handleAddOrUpdatePosition = async (values) => {
    const db = getDatabase();
    const status = values.status ? "active" : "inactive"; // Chuyển đổi giá trị Boolean thành chuỗi "active" hoặc "inactive"
    if (editingPosition) {
      const positionRef = ref(db, `positions/${editingPosition.id}`);
      await update(positionRef, { ...values, status });
      message.success(t("Position updated successfully!"));
    } else {
      const newPositionId = uuidv4();
      const positionRef = ref(db, `positions/${newPositionId}`);
      await set(positionRef, { ...values, status });
      message.success(t("Position added successfully!"));
    }
    setModalVisible(false);
    setEditingPosition(null);
    form.resetFields();
    const positionsRef = ref(db, "positions");
    const snapshot = await get(positionsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const formattedData = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setPositions(formattedData);
    } else {
      setPositions([]);
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    form.setFieldsValue({ ...position, status: position.status === "active" });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const db = getDatabase();
    await remove(ref(db, `positions/${id}`));
    message.success(t("Position deleted successfully!"));
    setPositions(positions.filter((position) => position.id !== id));
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingPosition(null);
    form.resetFields();
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${t("Name")}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={confirm}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={confirm}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {t("Search")}
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
            {t("Reset")}
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      filters: [
        { text: t("Active"), value: "active" },
        { text: t("Inactive"), value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? t("Active") : t("Inactive")}
        </Tag>
      ),
    },
    {
      title: t("Actions"),
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            {t("Edit")}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            type="danger"
          >
            {t("Delete")}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          form.setFieldsValue({ status: true });
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        {t("Add Position")}
      </Button>
      <Table
        columns={columns}
        dataSource={positions}
        rowKey="id"
        pagination={{ pageSize: 6 }}
      />
      <Modal
        title={editingPosition ? t("Edit Position") : t("Add Position")}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddOrUpdatePosition}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="name"
            label={t("Name")}
            rules={[{ required: true, message: t("Please input the name!") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("Description")}
            rules={[
              { required: true, message: t("Please input the description!") },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label={t("Status")} valuePropName="checked">
            <Switch
              checkedChildren={t("Active")}
              unCheckedChildren={t("Inactive")}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingPosition ? t("Update Position") : t("Add Position")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListPosition;
