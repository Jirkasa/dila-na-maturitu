import './Navigation.scss';

import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <div className='Navigation'>
            <Link to="/materialy" className='Navigation__link'>Materiály</Link>
            <Link to="/prihlaseni" className='Navigation__link'>Přihlásit se</Link>
            <Link to="/registrace" className='Navigation__link'>Vytvořit účet</Link>
        </div>
    );
}

export default Navigation;