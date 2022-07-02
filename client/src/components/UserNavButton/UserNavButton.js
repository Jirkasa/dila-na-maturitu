import './UserNavButton.scss';

import React from 'react';
import config from '../../config';

// BUTTON FOR LOGGED IN USER IN HEADER
function UserNavButton(props) {
    return (
        <button onClick={props.toogleDropdown} className='UserNavButton'>
            <div className='UserNavButton__user-icon'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-user`}></use>
                </svg>
            </div>
            <span>{props.children}</span>
            <div className={`UserNavButton__dropdown-icon ${props.opened ? "UserNavButton__dropdown-icon--rotated" : ""}`}>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-angle-down`}></use>
                </svg>
            </div>
        </button>
    );
}

export default UserNavButton;