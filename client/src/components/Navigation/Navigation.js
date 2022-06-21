import './Navigation.scss';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserNavButton from '../UserNavButton/UserNavButton';
import NavigationDropdown from '../NavigationDropdown/NavigationDropdown';

function Navigation() {
    const auth = useAuth();
    const [dropdownOpened, setDropdownOpened] = useState(false);
    const toogleDropdown = () => {setDropdownOpened(!dropdownOpened)};

    return (
        <nav className='Navigation'>
            {(!auth.currentUser || (auth.currentUser && auth.currentUser.username)) && <Link to="/materialy" className='Navigation__link'>Materiály</Link>}
            {
                auth.currentUser
                ? (
                    auth.currentUser.username
                    ? <UserNavButton opened={dropdownOpened} toogleDropdown={toogleDropdown}>{auth.currentUser.username}</UserNavButton>
                    : <Link to="/odhlaseni" onClick={auth.forceUpdate} className='Navigation__link'>Odhlásit se</Link>
                )
                : <>
                    <Link to="/prihlaseni" className='Navigation__link'>Přihlásit se</Link>
                    <Link to="/registrace" className='Navigation__link'>Vytvořit účet</Link>
                </>
            }
            <NavigationDropdown opened={dropdownOpened}/>
        </nav>
    );
}

export default Navigation;