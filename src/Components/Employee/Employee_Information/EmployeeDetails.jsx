import React from 'react';
import { Descriptions, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { employee } = state; // Assuming the employee data is passed via state

  const gotoEditPage = () => {
    navigate('/edit', { state: { employee } }); 
  };

  const returntoPrevious = () => {
    navigate('/list');
  };

  const handleDownloadCv = () => {
    const link = document.createElement('a');
    link.href = employee.cv_file;
    link.download = `${employee.name}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Descriptions
        title="Employee Details"
        bordered
        column={{
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
      >
        <Descriptions.Item label="Employee Name">{employee.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{employee.phone}</Descriptions.Item>
        <Descriptions.Item label="Role">{employee.role}</Descriptions.Item>
        <Descriptions.Item label="Status">{employee.status}</Descriptions.Item>
        <Descriptions.Item label="Position ID">{employee.positionId}</Descriptions.Item>
        <Descriptions.Item label="Project IDs">{employee.projectIds.join(', ')}</Descriptions.Item>
        <Descriptions.Item label="Skills">{employee.skills}</Descriptions.Item>
        <Descriptions.Item label="Contact">{employee.contact}</Descriptions.Item>
        <Descriptions.Item label="CV Skill">{employee.cv_list[0].cv_skill}</Descriptions.Item>
      </Descriptions>

      <Button type="primary" onClick={handleDownloadCv} style={{ background: 'blue', marginTop: '20px' }}>
        Export CV
      </Button>
      <Button type="primary" onClick={returntoPrevious} style={{ background: 'gray', marginTop: '20px' }}>
        Return
      </Button>
    </>
  );
};

export default EmployeeDetails;
