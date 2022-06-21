import './IllustrativeIcon.scss';

import React from 'react';
import config from '../../config';

function IllustrativeIcon(props) {

    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <div className='IllustrativeIcon' style={{ marginBottom: `${bottomMargin}rem` }}>
            <svg>
                <use xlinkHref={`${config.ICON_SPRITE_PATH}#${props.iconName}`}></use>
            </svg>
        </div>
    );
}

export default IllustrativeIcon;