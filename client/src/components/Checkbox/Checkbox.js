import './Checkbox.scss';

import React from 'react';
import config from '../../config';

function Checkbox(props) {
    return (
        <div className='Checkbox'>
            <input type="checkbox" {...props} className='Checkbox__input'/>
            <div className='Checkbox__icon'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-checkmark`}></use>
                </svg>
            </div>
        </div>
    );
}

export default Checkbox;