import './Page.scss';

import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function Page(props) {
    return (
        <div className='Page'>
            <Header/>
            <div className='Page__content'>
                {props.children}
            </div>
            <Footer/>
        </div>
    );
}

export default Page;