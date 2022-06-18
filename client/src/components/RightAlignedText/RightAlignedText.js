import './RightAlignedText.scss';

import React from 'react';

function RightAlignedText(props) {
    return (
        <div className='RightAlignedText'>{props.children}</div>
    );
}

export default RightAlignedText;