import './Button.scss';

import React from 'react';
import config from '../../config';

function ALinkButton(props) {
    const { iconName } = props;

    let cssClasses = "";
    cssClasses = props.smallText ? "Button--small-text" : cssClasses;
    cssClasses = props.fullWidth ? " Button--full-width" : cssClasses;

    // If icon name is specified, display button with icon
    if (iconName) {
        return (
            <a href={props.to} target="_blank" className={`Button Button--with-icon ${cssClasses}`}>
                <div className='Button__icon'>
                    <svg>
                        <use xlinkHref={`${config.ICON_SPRITE_PATH}#${iconName}`}></use>
                    </svg>
                </div>
                <span>{props.children}</span>
            </a>
        );
    }

    // display button (without icon)
    return <a href={props.to} target="_blank" className={`Button ${cssClasses}`}>{props.children}</a>;
}

export default ALinkButton;