import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Switch,
  Space,
  Skeleton,
} from "antd";
import { getDatabase, ref, set, update, remove, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  RollbackOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "../../styles/layouts/ListPosition.module.scss";
import PositionSkeleton from "../Loading/positionSkeleton";
import "../../styles/layouts/tablestyles.css" // Import the PositionSkeleton component

const { TextArea } = Input;

const ListPosition = () => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [showBin, setShowBin] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
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
        const filteredData = formattedData.filter(
          (position) => position.deleteStatus === showBin
        );
        setPositions(filteredData);
      } else {
        setPositions([]);
      }
      setLoading(false); // Set loading to false after data is fetched
    };

    // Simulate a delay to show the skeleton
    const timer = setTimeout(() => {
      fetchPositions();
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, [showBin]);

  const handleAddOrUpdatePosition = async (values) => {
    const db = getDatabase();
    const status = values.status ? "active" : "inactive";
    if (editingPosition) {
      const positionRef = ref(db, `positions/${editingPosition.id}`);
      await update(positionRef, { ...values, status, deleteStatus: false });
      message.success(t("Position updated successfully!"));
    } else {
      const newPositionId = uuidv4();
      const positionRef = ref(db, `positions/${newPositionId}`);
      await set(positionRef, {
        ...values,
        status,
        deleteStatus: false,
      });
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
      const filteredData = formattedData.filter(
        (position) => position.deleteStatus === showBin
      );
      setPositions(filteredData);
    } else {
      setPositions([]);
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    form.setFieldsValue({ ...position, status: position.status === "active" });
    setModalVisible(true);
  };

  const handleMoveToBin = async (id, status) => {
    if (status === "active") {
      message.error(t("Technology đang ở trạng thái Active không thể xóa"));
      return;
    }

    const db = getDatabase();
    const positionRef = ref(db, `positions/${id}`);
    await update(positionRef, { deleteStatus: true });
    message.success(t("Position moved to bin successfully!"));
    setPositions(positions.filter((position) => position.id !== id));
  };

  const handleRestore = async (id) => {
    const db = getDatabase();
    const positionRef = ref(db, `positions/${id}`);
    await update(positionRef, { deleteStatus: false });
    message.success(t("Position restored successfully!"));
    setPositions(positions.filter((position) => position.id !== id));
  };

  const handlePermanentDelete = async (id) => {
    const db = getDatabase();
    const positionRef = ref(db, `positions/${id}`);
    await remove(positionRef);
    message.success(t("Position deleted permanently!"));
    setPositions(positions.filter((position) => position.id !== id));
  };

  const handleViewBin = async () => {
    setShowBin(!showBin);
    const db = getDatabase();
    const positionsRef = ref(db, "positions");
    const snapshot = await get(positionsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const formattedData = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      const filteredData = formattedData.filter(
        (position) => position.deleteStatus === !showBin
      );
      setPositions(filteredData);
    } else {
      setPositions([]);
    }
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
      className: 'truncate-text', // Add this line to apply truncation
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
      align: "center",
      render: (text, record) => (
        <div className={styles["actions-container"]}>
          {showBin ? (
            <>
              <Button
                icon={<RollbackOutlined />}
                onClick={() => handleRestore(record.id)}
                className={styles["restore-button"]}
              >
                {t("Restore")}
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handlePermanentDelete(record.id)}
                className={styles["delete-button"]}
              >
                {t("Delete")}
              </Button>
            </>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={() => handleEdit(record)}
                className={styles["edit-button"]}
              >
                {t("Edit")}
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleMoveToBin(record.id, record.status)}
                type="danger"
                className={styles["delete-button"]}
              >
                {t("Move to Bin")}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles["list-position"]}>
      {loading ? (
        <Space className={styles["actions-container"]}>
          <Skeleton.Button style={{ width: 120 }} active />
          <Skeleton.Button style={{ width: 100 }} active />
        </Space>
      ) : (
        <Space className={styles["actions-container"]}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.setFieldsValue({ status: true });
              setModalVisible(true);
            }}
            className={styles["add-position-button"]}
          >
            {t("Add Position")}
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            onClick={handleViewBin}
            className={styles["view-bin-button"]}
          >
            {showBin ? t("Back to List") : t("View Bin")}
          </Button>
        </Space>
      )}
      <h1>LIST OF POSITION</h1>
      {loading ? (
        <PositionSkeleton />
      ) : (
        <Table
          columns={columns}
          dataSource={positions}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          className={styles["position-table"]}
        />
      )}
      <Modal
        title={editingPosition ? t("Edit Position") : t("Add Position")}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className={styles["modal"]}
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
