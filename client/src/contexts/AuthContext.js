import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import LoadPage from '../pages/LoadPage/LoadPage';
import CreateUsername from '../pages/CreateUsername/CreateUsername';
import AccountVerification from '../pages/AccountVerification/AccountVerification';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider(props) {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("DilaNaMaturitu_User")));
    const [accessToken, setAccessToken] = useState(localStorage.getItem("DilaNaMaturitu_AccessToken"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("DilaNaMaturitu_RefreshToken"));

    // used to force update (for example when URL address changes)
    const [update, setUpdate] = useState(false);

    const [loading, setLoading] = useState(true);


    // sends refresh token and loads user from server
    async function loadUser() {
        if (currentUser) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/token`, {}, {
                    headers: {
                        authorization: refreshToken
                    }
                });
                const newAccessToken = `Bearer ${res.data.accessToken}`;

                const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/users/${currentUser.id}`, {
                    headers: {
                        authorization: newAccessToken
                    }
                });

                localStorage.setItem("DilaNaMaturitu_AccessToken", newAccessToken);
                localStorage.setItem("DilaNaMaturitu_User", JSON.stringify(userRes.data.user));
                setAccessToken(newAccessToken);
                setCurrentUser(userRes.data.user);
            } catch(err) {
                await logout();
            }
        }
        setLoading(false);
    }

    async function login(email, password) {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
            email: email,
            password: password
        });

        const accessToken = `Bearer ${res.data.accessToken}`;
        const refreshToken = `Bearer ${res.data.refreshToken}`;

        const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/users/email`, {
            params: {
                email: email
            },
            headers: {
                authorization: accessToken
            }
        });

        localStorage.setItem("DilaNaMaturitu_AccessToken", accessToken);
        localStorage.setItem("DilaNaMaturitu_RefreshToken", refreshToken);
        localStorage.setItem("DilaNaMaturitu_User", JSON.stringify(userRes.data.user));
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setCurrentUser(userRes.data.user);
    }

    async function logout() {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, {
            headers: {
                authorization: refreshToken
            }
        });
        setCurrentUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("DilaNaMaturitu_User");
        localStorage.removeItem("DilaNaMaturitu_AccessToken");
        localStorage.removeItem("DilaNaMaturitu_RefreshToken");
    }

    function getHeaderConfig() {
        return {
            headers: {
                authorization: accessToken
            }
        }
    }


    useEffect(() => {
        loadUser();
        const intervalId = setInterval(loadUser, 1000*60*14);
        return () => clearInterval(intervalId);
    }, []);


    const value = {
        currentUser,
        login,
        logout,
        getHeaderConfig,
        updateCurrentUser: setCurrentUser,
        forceUpdate: () => setUpdate(!update)
    };

    let pageToRender;
    if (loading) {
        pageToRender = <LoadPage/>;
    } else if (currentUser && !currentUser.username && window.location.pathname !== "/odhlaseni") {
        pageToRender = <CreateUsername/>;
    } else if (currentUser && !currentUser.verified && window.location.pathname !== "/odhlaseni") {
        pageToRender = <AccountVerification/>;
    } else {
        pageToRender = props.children;
    }

    return (
        <AuthContext.Provider value={value}>
            {pageToRender}
        </AuthContext.Provider>
    );
}