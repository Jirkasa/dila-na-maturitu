import './Button.scss';

import React from 'react';
import config from '../../config';

// REPRESENTS BUTTON AS LINK
function ALinkButton(props) {
    // get icon name
    const { iconName } = props;

    // get css classes based on props
    let cssClasses = "";
    cssClasses += props.smallText ? "Button--small-text" : "";
    cssClasses += props.fullWidth ? " Button--full-width" : "";
    cssClasses += props.outlined ? " Button--outlined" : "";

    // If icon name is specified, render button with icon
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

    // render button (without icon)
    return <a href={props.to} target="_blank" className={`Button ${cssClasses}`}>{props.children}</a>;
}

export default ALinkButton;