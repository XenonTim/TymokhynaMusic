// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth.js';

const ProtectedRoute = ({ element: Element, adminOnly = false, onAuthChange }) => {
    const currentRole = getUserRole();

    if (!currentRole) {
        return <Navigate to="/auth" replace />;
    }

    if (adminOnly && currentRole !== 'admin') {
        return <Navigate to="/user" replace />;
    }

    return <Element role={currentRole} onUpdate={onAuthChange} />;
};

export default ProtectedRoute;