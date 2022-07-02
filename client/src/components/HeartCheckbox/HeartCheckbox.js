import './HeartCheckbox.scss';

import React from 'react';
import config from '../../config';

// HEART CHECKBOX
// - checkbox element that looks like heart
function HeartCheckbox(props) {
    return (
        <div className='HeartCheckbox'>
            <input type="checkbox" {...props} className='HeartCheckbox__checkbox'/>
            <div className='HeartCheckbox__icon HeartCheckbox__icon--base'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-heart-o`}></use>
                </svg>
            </div>
            <div className='HeartCheckbox__icon HeartCheckbox__icon--checked'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-heart`}></use>
                </svg>
            </div>
        </div>
    );
}

export default HeartCheckbox;