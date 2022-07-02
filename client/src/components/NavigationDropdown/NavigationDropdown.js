import './NavigationDropdown.scss';

import React from 'react';
import config from '../../config';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-collapse';

// NAVIGATION DROPDOWN
function NavigationDropdown(props) {
    return (
        <div className='NavigationDropdown'>
            <Collapse isOpened={props.opened}>
                <div className='NavigationDropdown__content'>
                    <Link to="/moje-materialy" className="NavigationDropdown__link">
                        <div className='NavigationDropdown__link-icon'>
                            <svg>
                                <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-file-text2`}></use>
                            </svg>
                        </div>
                        <span>Moje materiály</span>
                    </Link>
                    <Link to="/oblibene-materialy" className="NavigationDropdown__link">
                        <div className='NavigationDropdown__link-icon NavigationDropdown__link-icon--heart'>
                            <svg>
                                <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-heart-o`}></use>
                            </svg>
                        </div>
                        <span>Oblíbené materiály</span>
                    </Link>
                    <hr/>
                    <Link to="/odhlaseni" className="NavigationDropdown__link">
                        <div className='NavigationDropdown__link-icon'>
                            <svg>
                                <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-exit`}></use>
                            </svg>
                        </div>
                        <span>Odhlásit se</span>
                    </Link>
                </div>
            </Collapse>
        </div>
    );
}

export default NavigationDropdown;