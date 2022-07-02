import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// RENDERS CONTENT ONLY FOR LOGGED IN USERS
// - can be used to wrap pages, that are intended only for logged in users
function RequireAuth(props) {
    const auth = useAuth();

    // non-logged in users are redirected to home page
    if (!auth.currentUser) return <Navigate to="/"/>;
    // render child components
    return props.children;
}

export default RequireAuth;