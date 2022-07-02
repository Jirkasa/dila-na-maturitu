import './Button.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';

// REPRESENTS BUTTON AS REACT ROUTER LINK
function LinkButton(props) {
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
            <Link to={props.to} className={`Button Button--with-icon ${cssClasses}`}>
                <div className='Button__icon'>
                    <svg>
                        <use xlinkHref={`${config.ICON_SPRITE_PATH}#${iconName}`}></use>
                    </svg>
                </div>
                <span>{props.children}</span>
            </Link>
        );
    }

    // render button (without icon)
    return <Link to={props.to} className={`Button ${cssClasses}`}>{props.children}</Link>;
}

export default LinkButton;