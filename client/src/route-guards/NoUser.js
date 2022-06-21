import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NoUser(props) {
    const auth = useAuth();

    if (auth.currentUser) return <Navigate to="/"/>;
    return props.children;
}

export default NoUser;