// AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'SuperUser') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;


// AdminRoute.jsx
/*
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return (token && role === 'SuperUser') ? children : <Navigate to="/login" />;
};

export default AdminRoute;
*/