import './LoadIcon.scss';

import React from 'react';
import config from '../../config';

function LoadIcon(props) {
    return (
        <div className={`LoadIcon ${props.small ? "LoadIcon--small" : ""}`}>
            <svg>
                <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-spinner`}></use>
            </svg>
        </div>
    );
}

export default LoadIcon;