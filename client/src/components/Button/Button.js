import './Button.scss';

import React from 'react';
import config from '../../config';

function Button(props) {
    const { iconName } = props;

    // If icon name is specified, display button with icon
    if (iconName) {
        return (
            <button onClick={props.onClick} className="Button Button--with-icon">
                <div className='Button__icon'>
                    <svg>
                        <use xlinkHref={`${config.ICON_SPRITE_PATH}#${iconName}`}></use>
                    </svg>
                </div>
                <span>{props.children}</span>
            </button>
        );
    }

    // display button (without icon)
    return <button onClick={props.onClick} className='Button'>{props.children}</button>;
}

export default Button;