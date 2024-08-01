import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Button, Upload, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";
import { getDatabase, ref, get, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const EditEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { employee } = state;
  const { handleEdit } = useEmployees();
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [emails, setEmails] = useState([]);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const positionsRef = ref(db, "positions");
      const usersRef = ref(db, "users");

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

      const usersSnapshot = await get(usersRef);
      if (usersSnapshot.exists()) {
        const data = usersSnapshot.val();
        const emailList = Object.keys(data)
          .map((key) => ({
            id: key,
            email: data[key].email,
            isExist: data[key].IsExist === "true",
            isActive: data[key].status === "active",
            isAdmin: data[key].role === "Admin",
          }))
          .filter((user) => (!user.isExist && user.isActive && !user.isAdmin) || user.email === employee.email);
        setEmails(emailList);
      } else {
        setEmails([]);
      }
    };

    fetchData();
  }, [employee.email]);

  const handleSubmit = async (values) => {
    const storage = getStorage();
    const db = getDatabase();

    let cvUrl = employee.cv_file;
    if (cvFile) {
      const cvRef = storageRef(storage, `cvs/${employee.id}.pdf`);
      const snapshot = await uploadBytes(cvRef, cvFile);
      cvUrl = await getDownloadURL(snapshot.ref);
    }

    const updatedEmployee = {
      ...employee,
      name: values.name,
      phone: values.phone,
      email: values.email,
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
      await handleEdit(updatedEmployee);

      // Update IsExist values for old and new emails
 
  
      const oldEmail = emails.find(email => email.email === employee.email);
      const oldEmailRef = ref(db, `users/${oldEmail.id}`);
      const newEmail = emails.find(email => email.email === values.email);

      if (employee.email !== values.email) {
        if (newEmail) {
          const newEmailRef = ref(db, `users/${newEmail.id}`);
          await update(newEmailRef, { IsExist: "true" });
        }
        await update(oldEmailRef, { IsExist: "false" });
      }

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

  const emailValidator = (_, value) => {
    if (!value || /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid email address with a domain name (e.g., @gmail.com)"));
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
          {
            validator: (_, value) => {
              return emails.some((user) => user.email === value)
                ? Promise.resolve()
                : Promise.reject("Email not available!");
            },
          },
          { validator: emailValidator },
        ]}
      >
        <Select>
          {emails.map((user) => (
            <Option key={user.id} value={user.email}>
              {user.email}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={t("Phone")}
        name="phone"
        rules={[
          { required: true, message: t("Please input the phone number!") },
          {
            pattern: /^[0-9]{10,16}$/,
            message: t("Phone number must be between 10 and 16 digits"),
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
