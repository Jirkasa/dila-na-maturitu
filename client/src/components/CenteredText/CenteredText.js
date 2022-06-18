import './CenteredText.scss';

import React from 'react';

function CenteredText(props) {
    return (
        <div className='CenteredText'>{props.children}</div>
    );
}

export default CenteredText;