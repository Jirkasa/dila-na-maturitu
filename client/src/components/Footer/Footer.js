import './Footer.scss';

import React from 'react';

// FOOTER
// - displayed at the bottom of every page
function Footer() {
    return (
        <footer className='Footer'>
            <p>Tento web vytvořil <a href="https://jirkasa.github.io/" target="_blank" className="Footer__link">Jiří Satora</a></p>
        </footer>
    );
}

export default Footer;