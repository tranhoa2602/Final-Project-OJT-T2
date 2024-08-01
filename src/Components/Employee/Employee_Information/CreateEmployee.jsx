import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get, update, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { database } from "../../../../firebaseConfig";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

const { Option } = Select;

const CreateEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [emails, setEmails] = useState([]);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const positionsRef = ref(database, "positions");
      const usersRef = ref(database, "users");

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
          .filter((user) => !user.isExist && user.isActive && !user.isAdmin);
        setEmails(emailList);
      } else {
        setEmails([]);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    if (!cvFile) {
      message.error("Please upload a CV file!");
      return;
    }

    const selectedEmail = emails.find((email) => email.email === values.email);
    if (!selectedEmail) {
      message.error("Email not available!");
      return;
    }

    const newEmployeeId = uuidv4();
    const storage = getStorage();
    const cvRef = storageRef(storage, `cvs/${newEmployeeId}.pdf`);

    try {
      const snapshot = await uploadBytes(cvRef, cvFile);
      const cvUrl = await getDownloadURL(snapshot.ref);

      const newEmployee = {
        id: newEmployeeId,
        isAdmin: false,
        name: values.name,
        phone: values.phone,
        email: values.email,
        role: "Employee",
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

      const db = getDatabase();
      const employeeRef = ref(db, `employees/${newEmployeeId}`);
      await set(employeeRef, newEmployee);

      // Update IsExist to true for the selected email
      const emailRef = ref(db, `users/${selectedEmail.id}`);
      await update(emailRef, { IsExist: "true" });

      navigate("/list");
      message.success("Successfully added employee");
    } catch (error) {
      console.error("Error adding employee:", error);
      message.error("Failed to add employee");
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
    return Promise.reject(
      new Error(
        "Please enter a valid email address with a domain name (e.g., @gmail.com)"
      )
    );
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      style={{ height: "100vh", marginTop: "20px" }}
      initialValues={{ status: true }}
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
        rules={[{ required: true, message: t("Please upload a CV file!") }]}
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

export default CreateEmployee;
