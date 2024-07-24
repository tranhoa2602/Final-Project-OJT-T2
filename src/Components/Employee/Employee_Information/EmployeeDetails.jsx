import React from 'react';
import { Descriptions, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const EmployeeDetails = () => {
  const navigate = useNavigate();

  const gotoEditPage = () => {
    navigate('/edit-user'); 
  };

  const returntoPrevious = () => {
    navigate('/user-list');
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
    {
      label: 'Options',
      children: (
        <>
          <Button type="primary" onClick={gotoEditPage}>
            Edit
          </Button>
          <Button type="primary" style={{ background: 'red' }}>
            Delete
          </Button>
          <Button type="primary" onClick={returntoPrevious} style={{ background: 'gray' }}>
            Return
          </Button>
        </>
      ),
    },
  ];

  return (
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
  );
};

export default EmployeeDetails;
