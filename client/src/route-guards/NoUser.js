import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// RENDERS CONTENT ONLY FOR NON-LOGGED IN USERS
// - can be used to wrap pages, that are intended only for non-logged in users
function NoUser(props) {
    const auth = useAuth();

    // logged in users are redirected to home page
    if (auth.currentUser) return <Navigate to="/"/>;
    // render child components
    return props.children;
}

export default NoUser;