import './Button.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';

function LinkButton(props) {
    const { iconName } = props;

    // If icon name is specified, display button with icon
    if (iconName) {
        return (
            <Link to={props.to} className="Button Button--with-icon">
                <div className='Button__icon'>
                    <svg>
                        <use xlinkHref={`${config.ICON_SPRITE_PATH}#${iconName}`}></use>
                    </svg>
                </div>
                <span>{props.children}</span>
            </Link>
        );
    }

    // display button (without icon)
    return <Link to={props.to} className="Button">{props.children}</Link>;
}

export default LinkButton;