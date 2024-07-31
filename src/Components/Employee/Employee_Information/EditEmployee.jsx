import React, { useEffect, useState } from "react";
import { Form, Input, Select, Switch, Button, Upload, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";
import { getDatabase, ref, get } from "firebase/database";

const { Option } = Select;

const EditEmployee = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { employee } = state; // Assuming the employee data is passed via state
  const { handleEdit } = useEmployees();
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [emails, setEmails] = useState([]);
  const [cvFile, setCvFile] = useState(employee.cv_file || "");

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const positionsRef = ref(db, "positions");
      const projectsRef = ref(db, "projects");
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
    const updatedEmployee = {
      ...employee,
      name: values.name || employee.name,
      phone: values.phone || employee.phone,
      email: values.email || employee.email,
      status: values.status !== undefined ? (values.status ? "active" : "inactive") : employee.status,
      positionName: values.positionName || employee.positionName,
      projectNames: values.projectNames || employee.projectNames,
      skills: values.skills || employee.skills,
      contact: values.contact || employee.contact,
      cv_file: cvFile || employee.cvFile,
      cv_list: [
        {
          cv_skill: values.cv_skill || employee.cv_list[0].cv_skill,
          cv_experience: [
            {
              time_work: values.time_work || employee.cv_list[0].cv_experience[0].time_work,
              description: values.description || employee.cv_list[0].cv_experience[0].description,
            },
          ],
        },
      ],
    };


    try {
      await handleEdit(updatedEmployee);
      navigate("/list");
      // Redirect or show success message
    } catch (error) {
      console.error("Error updating employee: ", error);
      console.log(employee.cvFile)
    }
  };

  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCvFile(reader.result);
        message.success("CV uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCvFile(e.target.result);
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
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
      initialValues={{
        name: employee.name,
        phone: employee.phone,
        email: employee.email,
        status: employee.status === "active",
        positionName: employee.positionName,
        projectNames: employee.projectNames,
        skills: employee.skills,
        contact: employee.contact,
        cv_skill: employee.cv_list[0].cv_skill,
        time_work: employee.cv_list[0].cv_experience[0].time_work,
        description: employee.cv_list[0].cv_experience[0].description,
      }}
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
        rules={[{ required: true, message: "Please input the email!" },
          { validator: emailValidator },]}
      >
            <Select mode="multiple">
          {emails.map((user) => (
            <Option key={user.id} value={user.email}>
              {user.email}
            </Option>
          ))}
        </Select>
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
        name="positionName"
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
        label="Projects"
        name="projectNames"
        rules={[{ required: true, message: "Please input the projects!" }]}
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
        label="Time Work"
        name="time_work"
        rules={[{ required: true, message: "Please input the time work!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="CV File" name="cv_file" valuePropName="file"
                getValueFromEvent={handleCvUpload}>
        <Upload
          beforeUpload={() => false} maxCount={1}
          
        >
          <Button>Upload CV</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Employee
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

export default EditEmployee;
