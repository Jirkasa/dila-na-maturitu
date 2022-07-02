import './RightAlignedText.scss';

import React from 'react';

// WRAPPER TO RIGHT ALIGN TEXT
function RightAlignedText(props) {
    return (
        <div className='RightAlignedText'>{props.children}</div>
    );
}

export default RightAlignedText;