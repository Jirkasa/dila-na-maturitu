import './Header.scss';

import React, { useEffect, useRef, useState } from 'react';
import config from '../../config';
import Navigation from '../Navigation/Navigation';
import { Link } from 'react-router-dom';

// HEADER
function Header() {
    // determines whether header is in fixed or static state
    const [fixedHeader, setFixedHeader] = useState(false);
    // ref to header container
    const headerContainer = useRef();

    // called when header is rendered for the first time
    useEffect(() => {
        // creater callback for intersection observer
        const obsCallback = function([entry]) {
            if (!entry.isIntersecting) {
                // if user scrolled down, header becomes fixed
                setFixedHeader(true);
            } else {
                // if user scrolled to the top of the page, header becomes static
                setFixedHeader(false);
            }
        }
        // create intersection observer options
        const obsOptions = {
            root: null, // intersection will be with viewport
            threshold: 0.99
        };
        // create intersection observer
        const observer = new IntersectionObserver(obsCallback, obsOptions);

        // observer header container
        observer.observe(headerContainer.current);

        // cleanup when header is unmounted
        return () => observer.disconnect();
    }, []);

    // render header in header container
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