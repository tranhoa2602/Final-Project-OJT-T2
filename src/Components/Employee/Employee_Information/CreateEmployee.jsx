import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Switch, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";
import { getDatabase, ref, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { database } from "../../../../firebaseConfig";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const CreateEmployee = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleAdd } = useEmployees();
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [emails, setEmails] = useState([]);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const positionsRef = ref(database, "positions");
      const projectsRef = ref(database, "projects");
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

      const projectsSnapshot = await get(projectsRef);
      if (projectsSnapshot.exists()) {
        const data = projectsSnapshot.val();
        const formattedData = Object.keys(data).map((key) => ({
          name: data[key].name,
          ...data[key],
        }));
        setProjects(formattedData);
      } else {
        setProjects([]);
      }

      const usersSnapshot = await get(usersRef);
      if (usersSnapshot.exists()) {
        const data = usersSnapshot.val();
        const emailList = Object.keys(data).map((key) => ({
          id: key,
          email: data[key].email,
        }));
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
        projectNames: values.projectNames || [],
        cv_file: cvUrl,
        cv_list: [
          {
            cv_skill: values.cv_skill,
            cv_experience: [
              {
                time_work: values.time_work,
                description: values.description,
              },
            ],
          },
        ],
      };

      await handleAdd(newEmployee);
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
    return Promise.reject(new Error("Please enter a valid email address with a domain name (e.g., @gmail.com)"));
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
          { required: true, message: t("Please input the email!") },
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
        rules={[{ required: true, message: t("Please input the phone number!") }]}
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

      <Form.Item
        label="Projects"
        name="projectNames"
        rules={[{ required: true, message: t("Please input the project names!") }]}
      >
        <Select mode="multiple">
          {projects.map((project) => (
            <Option key={project.name} value={project.name}>
              {project.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={t("Skill")}
        name="cv_skill"
        rules={[{ required: true, message: t("Please input the skill!") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("Time Work")}
        name="time_work"
        rules={[{ required: true, message: t("Please input the time work!") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t("Description")} name="description">
        <Input />
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
