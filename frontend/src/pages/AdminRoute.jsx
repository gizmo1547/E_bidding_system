// AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return (token && role === 'SuperUser') ? children : <Navigate to="/login" />;
};

export default AdminRoute;
