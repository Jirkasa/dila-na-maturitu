import './LabelSecondary.scss';

import React from 'react';

function LabelSecondary(props) {
    return (
        <label {...props} className='LabelSecondary'>{props.children}</label>
    );
}

export default LabelSecondary;