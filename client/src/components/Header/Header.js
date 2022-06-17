import './Header.scss';

import React from 'react';
import config from '../../config';
import Navigation from '../Navigation/Navigation';

function Header() {
    return (
        <header className='Header'>
            <div className='Header__content'>
                <h2 className='Header__title'>{config.APP_NAME}</h2>
                <Navigation/>
            </div>
        </header>
    );
}

export default Header;