import './Navigation.scss';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserNavButton from '../UserNavButton/UserNavButton';
import NavigationDropdown from '../NavigationDropdown/NavigationDropdown';
import NavigationToggleButton from '../NavigationToggleButton/NavigationToggleButton';
import { Collapse } from 'react-collapse';

// NAVIGATION FOR HEADER
function Navigation() {
    const auth = useAuth();

    // determines whether dropdown is opened
    const [dropdownOpened, setDropdownOpened] = useState(false);
    // determines whether navigation is displayed for smaller screens
    const [navigationOpened, setNavigationOpened] = useState(false);

    // FUNCTION to toggle (open/close) dropdown
    const toogleDropdown = () => {setDropdownOpened(!dropdownOpened)};

    // render navigation
    return (
        <>
            <NavigationToggleButton onClick={() => setNavigationOpened(!navigationOpened)} opened={navigationOpened}/>
            <nav className={`Navigation ${navigationOpened ? "Navigation--opened" : ""}`}>
                {(!auth.currentUser || (auth.currentUser && auth.currentUser.username)) && <Link to="/materialy" className='Navigation__link'>Materiály</Link>}
                {
                    auth.currentUser
                    ? ( // if user is logged in
                        (auth.currentUser.username && auth.currentUser.verified)
                            // if user is verified and has username, User navigation is displayed
                        ? <UserNavButton opened={dropdownOpened} toogleDropdown={toogleDropdown}>{auth.currentUser.username}</UserNavButton>
                            // else logout button is displayed
                        : <Link to="/odhlaseni" onClick={auth.forceUpdate} className='Navigation__link'>Odhlásit se</Link>
                    ) // else login and register buttons are displayed
                    : <>
                        <Link to="/prihlaseni" className='Navigation__link'>Přihlásit se</Link>
                        <Link to="/registrace" className='Navigation__link'>Vytvořit účet</Link>
                    </>
                }
                <NavigationDropdown opened={dropdownOpened}/>
            </nav>
        </>
    );
}

export default Navigation;