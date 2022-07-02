import './StrikeThroughText.scss';

import React from 'react';

// STRIKE THROUGH TEXT
function StrikeThroughText(props) {
    return <span className='StrikeThroughText'>{props.children}</span>
}

export default StrikeThroughText;