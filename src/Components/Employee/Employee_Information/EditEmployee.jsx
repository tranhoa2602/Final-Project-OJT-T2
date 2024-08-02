import React, { useEffect, useState } from "react";
import { Form, Input, Select, Switch, Button, Upload, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const EditEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { employee } = state;
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const positionsRef = ref(db, "positions");

      const positionsSnapshot = await get(positionsRef);
      if (positionsSnapshot.exists()) {
        const data = positionsSnapshot.val();
        const formattedData = Object.keys(data).map((key) => ({
          name: data[key].name,
          ...data[key],
        }));
        setPositions(formattedData);
      } else {
        setPositions([]);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    const storage = getStorage();
    const db = getDatabase();

    let cvUrl = employee.cv_file;
    if (cvFile) {
      const cvRef = storageRef(storage, `cvs/${employee.key}.pdf`);
      const snapshot = await uploadBytes(cvRef, cvFile);
      cvUrl = await getDownloadURL(snapshot.ref);
    }

    const updatedEmployee = {
      ...employee,
      name: values.name,
      phone: values.phone,
      status: values.status ? "active" : "inactive",
      positionName: values.positionName,
      cv_file: cvUrl,
      cv_list: [
        {
          cv_experience: [
            {
              description: values.description,
            },
          ],
        },
      ],
    };

    try {
      const employeeRef = ref(db, `employees/${employee.key}`);
      await update(employeeRef, updatedEmployee);

      navigate("/list");
      message.success("Successfully edited employee");
    } catch (error) {
      console.error("Error editing employee:", error);
      message.error("Failed to edit employee");
    }
  };

  const handleCvUpload = ({ file }) => {
    setCvFile(file);
    return false; // Prevents the default behavior of uploading the file
  };

  const gotoEmployeeList = () => {
    navigate("/list");
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      style={{ height: "100vh", marginTop: "20px" }}
      initialValues={{
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        status: employee.status === "active",
        positionName: employee.positionName,
        description: employee.cv_list[0]?.cv_experience[0]?.description,
      }}
    >
      <Form.Item
        label={t("Name")}
        name="name"
        rules={[{ required: true, message: t("Please input the name!") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("Email")}
        name="email"
        rules={[
          { required: true, message: "Please input the email!" },
          { type: "email", message: "Please input a valid email!" },
        ]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label={t("Phone")}
        name="phone"
        rules={[
          { required: true, message: t("Please input the phone number!") },
          {
            pattern: /^0[0-9]{9,15}$/,
            message: t("Phone number must have 10 number"),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Status" name="status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item
        label="Position"
        name="positionName"
        rules={[{ required: true, message: t("Please select the position!") }]}
      >
        <Select>
          {positions.map((position) => (
            <Option key={position.name} value={position.name}>
              {position.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t("Description")} name="description">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label={t("CV Upload")}
        name="cv_file"
        valuePropName="file"
        getValueFromEvent={handleCvUpload}
      >
        <Upload beforeUpload={() => false} maxCount={1}>
          <Button>Upload CV</Button>
        </Upload>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {t("Submit")}
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" onClick={gotoEmployeeList}>
          {t("Back")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditEmployee;
