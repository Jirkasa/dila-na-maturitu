import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function RequireAuth(props) {
    const auth = useAuth();

    if (!auth.currentUser) return <Navigate to="/"/>;
    return props.children;
}

export default RequireAuth;