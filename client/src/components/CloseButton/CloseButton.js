import './CloseButton.scss';

import React from 'react';
import config from '../../config';

function CloseButton(props) {
    return (
        <button {...props} className='CloseButton'>
            <svg>
                <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-cross`}></use>
            </svg>
            <span>{props.children}</span>
        </button>
    );
}

export default CloseButton;