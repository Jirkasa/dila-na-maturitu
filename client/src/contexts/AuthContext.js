import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import LoadPage from '../pages/LoadPage/LoadPage';
import CreateUsername from '../pages/CreateUsername/CreateUsername';
import AccountVerification from '../pages/AccountVerification/AccountVerification';

// create Auth Context
const AuthContext = React.createContext();

// hook to use Auth Context
export function useAuth() {
    return useContext(AuthContext);
}

// used to wrap components that need access to Auth Context
// - renders Context Provider
export function AuthProvider(props) {
    // currently logged in user
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("DilaNaMaturitu_User")));
    // access and refresh token
    const [accessToken, setAccessToken] = useState(localStorage.getItem("DilaNaMaturitu_AccessToken"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("DilaNaMaturitu_RefreshToken"));

    // used to perform force update (for example when URL address changes)
    const [update, setUpdate] = useState(false);

    const [loading, setLoading] = useState(true);


    // sends refresh token and loads user from server
    async function loadUser() {
        // if user is logged in
        if (currentUser) {
            try {
                // send request to get new access token using refresh token
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/token`, {}, {
                    headers: {
                        authorization: refreshToken
                    }
                });
                // get new access token from response
                const newAccessToken = `Bearer ${res.data.accessToken}`;

                // send request to get user from server
                const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/users/${currentUser.id}`, {
                    headers: {
                        authorization: newAccessToken
                    }
                });

                // store new access token and user to local storage
                localStorage.setItem("DilaNaMaturitu_AccessToken", newAccessToken);
                localStorage.setItem("DilaNaMaturitu_User", JSON.stringify(userRes.data.user));
                // store new access token and user to state
                setAccessToken(newAccessToken);
                setCurrentUser(userRes.data.user);
            } catch(err) {
                // if an error occured, user is logged out
                await logout();
            }
        }
        // user has been loaded
        setLoading(false);
    }

    // FUNCTION to login user
    async function login(email, password) {
        // send request to login user
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
            email: email,
            password: password
        });

        // get access and refresh token from response
        const accessToken = `Bearer ${res.data.accessToken}`;
        const refreshToken = `Bearer ${res.data.refreshToken}`;

        // send request to get user from server by email
        const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/users/email`, {
            params: {
                email: email
            },
            headers: {
                authorization: accessToken
            }
        });

        // store access token, refresh token and user to local storage
        localStorage.setItem("DilaNaMaturitu_AccessToken", accessToken);
        localStorage.setItem("DilaNaMaturitu_RefreshToken", refreshToken);
        localStorage.setItem("DilaNaMaturitu_User", JSON.stringify(userRes.data.user));
        // store access token, refresh token and user to state
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setCurrentUser(userRes.data.user);
    }

    // FUNCTION to logout user
    async function logout() {
        // send request to logout user (remove refresh token from database)
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, {
            headers: {
                authorization: refreshToken
            }
        });
        // remove access token, refresh token and user from state
        setCurrentUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        // remove access token, refresh token and user from local storage
        localStorage.removeItem("DilaNaMaturitu_User");
        localStorage.removeItem("DilaNaMaturitu_AccessToken");
        localStorage.removeItem("DilaNaMaturitu_RefreshToken");
    }

    // FUNCTION to get header config
    // - returns request config with authorization header set
    function getHeaderConfig() {
        return {
            headers: {
                authorization: accessToken,
            }
        }
    }

    // called when web app is rendered for the first time
    useEffect(() => {
        // load user (and get new access token using refresh token)
        loadUser();
        // access token is valid for 15 minutes, so every 14 minutes is automatically called loadUser function to get new access token
        const intervalId = setInterval(loadUser, 1000*60*14);
        return () => clearInterval(intervalId);
    }, []);


    // create value for Context Provider
    const value = {
        currentUser, // currently logged in user
        login, // function to login user
        logout, // function to logout user
        getHeaderConfig, // function to get request config with authorization header set
        updateCurrentUser: setCurrentUser, // function to update currently logged in user
        forceUpdate: () => setUpdate(!update) // function to perform force update
    };

    // determine what should be rendered
    let pageToRender;
    if (loading) {
        // if user is being loaded for the first time (user opens web app), loading page is rendered
        pageToRender = <LoadPage/>;
    } else if (currentUser && !currentUser.username && window.location.pathname !== "/odhlaseni") {
        // if user has no username yet, Create Username page is rendered
        pageToRender = <CreateUsername/>;
    } else if (currentUser && !currentUser.verified && window.location.pathname !== "/odhlaseni") {
        // if user is not verified, Account Verification page is rendered
        pageToRender = <AccountVerification/>;
    } else {
        // child components are rendered
        pageToRender = props.children;
    }

    // render
    return (
        <AuthContext.Provider value={value}>
            {pageToRender}
        </AuthContext.Provider>
    );
}