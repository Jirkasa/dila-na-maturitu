import './IllustrativeIcon.scss';

import React from 'react';
import config from '../../config';

// ILLUSTRATIVE ICON
function IllustrativeIcon(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render Illustration Icon
    return (
        <div className='IllustrativeIcon' style={{ marginBottom: `${bottomMargin}rem` }}>
            <svg>
                <use xlinkHref={`${config.ICON_SPRITE_PATH}#${props.iconName}`}></use>
            </svg>
        </div>
    );
}

export default IllustrativeIcon;