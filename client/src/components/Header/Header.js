import './Header.scss';

import React, { useEffect, useRef, useState } from 'react';
import config from '../../config';
import Navigation from '../Navigation/Navigation';
import { Link } from 'react-router-dom';

function Header() {
    const [fixedHeader, setFixedHeader] = useState(false);
    const headerContainer = useRef();

    useEffect(() => {
        const obsCallback = function([entry]) {
            if (!entry.isIntersecting) {
                setFixedHeader(true);
            } else {
                setFixedHeader(false);
            }
        }
        const obsOptions = {
            root: null, // intersection will be with viewport
            threshold: 0.99
        };
        const observer = new IntersectionObserver(obsCallback, obsOptions);
        observer.observe(headerContainer.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={headerContainer} className='HeaderContainer'>
            <header className={`Header ${fixedHeader ? "Header--fixed" : ""}`}>
                <div className='Header__content'>
                    <Link to="/" className='Header__title'>{config.APP_NAME}</Link>
                    <Navigation/>
                </div>
            </header>
        </div>
    );
}

export default Header;