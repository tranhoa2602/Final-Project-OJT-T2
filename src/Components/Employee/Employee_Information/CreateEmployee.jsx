import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Switch, Upload, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";
import { getDatabase, ref, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { database } from "../../../../firebaseConfig";

const { Option } = Select;

const CreateEmployee = () => {
  const navigate = useNavigate();
  const { handleAdd } = useEmployees();
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const positionsRef = ref(database, "positions");
      const projectsRef = ref(database, "projects");

      const positionsSnapshot = await get(positionsRef);
      if (positionsSnapshot.exists()) {
        const data = positionsSnapshot.val();
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
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
          id: key,
          ...data[key],
        }));
        setProjects(formattedData);
      } else {
        setProjects([]);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    if (!cvFile) {
      message.error("Please upload a CV file!");
      return;
    }

    const newEmployee = {
      id: uuidv4(),
      isAdmin: false,
      name: values.name,
      phone: values.phone,
      email: values.email,
      role: "Employee",
      status: values.status ? "active" : "inactive",
      positionId: values.positionId,
      projectIds: values.projectIds || [],
      skills: values.skills,
      contact: values.contact,
      cv_file: cvFile,
      cv_list: [
        {
          cv_skill: values.cv_skill,
          cv_experience: [
            {
              work_position: values.work_position,
              time_work: values.time_work,
              description: values.description,
            },
          ],
        },
      ],
    };

    try {
      await handleAdd(newEmployee);
      message.success("Employee added successfully");
      navigate("/list");
    } catch (error) {
      console.error("Error adding employee: ", error);
      message.error("Error adding employee");
    }
  };


  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    console.log("Selected file:", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result.split(",")[1];
        setCvFile(base64File); // Store only the base64 part
        console.log("CV file in base64:", base64File);
        message.success("CV uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64File = e.target.result.split(",")[1];
      setCvFile(base64File); // Store only the base64 part
      console.log("CV file in base64:", base64File);
      message.success("CV uploaded successfully");
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  const gotoEmployeeList = () => {
    navigate("/list");
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      style={{ height: "100vh", marginTop: "20px" }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input the name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input the email!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: "Please input the phone number!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Status" name="status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item
        label="Position"
        name="positionId"
        rules={[{ required: true, message: "Please select the position!" }]}
      >
        <Select>
          {positions.map((position) => (
            <Option key={position.id} value={position.id}>
              {position.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Project IDs"
        name="projectIds"
        rules={[{ required: true, message: "Please input the project IDs!" }]}
      >
        <Select mode="multiple">
          {projects.map((project) => (
            <Option key={project.id} value={project.id}>
              {project.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Skills"
        name="skills"
        rules={[{ required: true, message: "Please input the skills!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contact"
        name="contact"
        rules={[{ required: true, message: "Please input the contact!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="CV Skill"
        name="cv_skill"
        rules={[{ required: true, message: "Please input the CV skill!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Work Position"
        name="work_position"
        rules={[{ required: true, message: "Please input the work position!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Time Work"
        name="time_work"
        rules={[{ required: true, message: "Please input the time work!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input />
      </Form.Item>

      <Form.Item
        label="CV Upload"
        name="cv_file"
        rules={[{ required: true, message: "Please upload a CV file!" }]}
      >
        <Upload beforeUpload={() => false} onChange={handleCvUpload}>
          <Button>Click to Upload CV</Button>
        </Upload>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" onClick={gotoEmployeeList}>
          Back
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateEmployee;
