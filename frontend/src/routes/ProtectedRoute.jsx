import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('token not found!')
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (allowedRoles.includes(userRole)) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
