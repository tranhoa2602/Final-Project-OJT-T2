import React, {useState} from "react";
import { Button, Form, Input, Select, message, InputNumber, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";
import { UploadOutlined } from "@ant-design/icons";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const Create = () => {
  const navigate = useNavigate();
  const { handleAdd } = useEmployees();
  const [form] = Form.useForm();
  const [cvFile, setCvFile] = useState(null);

  const handleFileChange = ({ file }) => {
    setCvFile(file);
  };

  const gotoEmployeeList = () => {
    navigate('/list'); 
  };

  const handleSubmit = (values) => {
    const employeeData = {
      id: "",
      isAdmin: values.role === "admin",
      name: values.name,
      phone: values.phone,
      email: values.email,
      password: values.password,
      role: "employee",
      status: values.status,
      positionId: values.positionId,
      projectIds: values.projectIds ? values.projectIds.split(",").map(Number) : [],
      skills: values.skills,
      contact: values.contact,
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

    handleAdd(employeeData);
    message.success("Employee added successfully!");
    navigate("/list");
  };

  return (
    <Form
      {...formItemLayout}
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

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input the password!" }]}
      >
        <Input.Password />
      </Form.Item>


      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Please input the status!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Position ID"
        name="positionId"
        rules={[{ required: true, message: "Please input the position ID!" }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label="Project IDs"
        name="projectIds"
        rules={[{ required: true, message: "Please input the project IDs!" }]}
      >
        <Input />
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

      <Form.Item
        label="Description"
        name="description"
       
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Upload CV"
        name="cv_file"
        rules={[{ required: true, message: "Please upload the CV file!" }]}
      >
        <Upload beforeUpload={() => false} onChange={handleFileChange}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit" onClick={gotoEmployeeList}>
          Back
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Create;
