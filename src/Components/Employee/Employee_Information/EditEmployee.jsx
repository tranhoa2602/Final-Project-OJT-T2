import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Switch,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useEmployees } from "./EmployeeContext";

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

const EditEmployee = () => {
  const navigate = useNavigate();
  const { handleEdit, employees } = useEmployees();
  const location = useLocation();
  const [form] = Form.useForm();

  const gotoEmployeeList = () => {
    navigate("/list");
  };

  // Get the employee data passed through the location state
  const employee = location.state?.employee;

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        ...employee,
        cv_skill: employee.cv_list[0]?.cv_skill || "",
        work_position:
          employee.cv_list[0]?.cv_experience[0]?.work_position || "",
        time_work: employee.cv_list[0]?.cv_experience[0]?.time_work || "",
        description: employee.cv_list[0]?.cv_experience[0]?.description || "",
      });
    }
  }, [employee, form]);

  const handleSubmit = (values) => {
    const updatedEmployee = {
      ...employee,
      ...values,
      status: values.status ? "active" : "inactive",
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

    handleEdit(updatedEmployee);
    message.success("Employee updated successfully!");
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

      <Form.Item label="Description" name="description">
        <Input />
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

export default EditEmployee;
