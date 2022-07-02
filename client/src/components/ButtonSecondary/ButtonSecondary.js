import './ButtonSecondary.scss';

import React from 'react';

// REPRESENTS BUTTON AS LINK
function ButtonSecondary(props) {
    return (
        <a href={props.to} className="ButtonSecondary">
            <div className='ButtonSecondary__icon'>
                <img src={props.iconPath}/>
            </div>
            <span>{props.children}</span>
        </a>
    );
}

export default ButtonSecondary;