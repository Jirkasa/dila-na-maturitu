import './NavigationToggleButton.scss';

import React from 'react';

function NavigationToggleButton(props) {
    return (
        <button onClick={props.onClick} className={`NavigationToggleButton ${props.opened ? "NavigationToggleButton--opened" : ""}`}>
            <div className='NavigationToggleButton__icon'></div>
        </button>
    )
}

export default NavigationToggleButton;