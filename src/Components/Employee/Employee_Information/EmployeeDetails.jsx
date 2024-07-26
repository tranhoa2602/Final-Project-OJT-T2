import React from 'react';
import { Descriptions, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const EmployeeDetails = () => {
  const navigate = useNavigate();

  const gotoEditPage = () => {
    navigate('/edit'); 
  };

  const returntoPrevious = () => {
    navigate('/list');
  };

  const items = [
    {
      label: 'Employee Name',
      children: 'John Doe',
    },
    {
      label: 'Age',
      children: '25',
    },
    {
      label: 'Date of Birth',
      children: '2003-11-23',
    },
    {
      label: 'email',
      children: 'test@gmail.com',
    },
    {
      label: 'id',
      children: '1',
    },
  ];

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
      {items.map((item, index) => (
        <Descriptions.Item key={index} label={item.label}>
          {item.children}
        </Descriptions.Item>
      ))}
    </Descriptions>
    <Button type="primary" onClick={returntoPrevious} style={{ background: 'gray', marginTop: '20px' }}>
            Return
    </Button>
    </>
  );
};

export default EmployeeDetails;
