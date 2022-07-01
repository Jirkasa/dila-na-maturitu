import './StrikeThroughText.scss';

import React from 'react';

function StrikeThroughText(props) {
    return <span className='StrikeThroughText'>{props.children}</span>
}

export default StrikeThroughText;