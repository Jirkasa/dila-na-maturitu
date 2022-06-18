import './Header.scss';

import React from 'react';
import config from '../../config';
import Navigation from '../Navigation/Navigation';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='Header'>
            <div className='Header__content'>
                <Link to="/" className='Header__title'>{config.APP_NAME}</Link>
                <Navigation/>
            </div>
        </header>
    );
}

export default Header;