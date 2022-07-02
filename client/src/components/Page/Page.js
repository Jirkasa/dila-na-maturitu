import './Page.scss';

import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

// WRAPPER FOR PAGES
// - contains header, footer and renders content of page
function Page(props) {
    return (
        <div className='Page'>
            <Header/>
            <div className={`Page__content ${props.flex ? "Page__content--flex" : ""}`}>
                {props.children}
            </div>
            <Footer/>
        </div>
    );
}

export default Page;