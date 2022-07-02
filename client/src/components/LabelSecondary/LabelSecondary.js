import './LabelSecondary.scss';

import React from 'react';

// LABEL - SECONDARY
function LabelSecondary(props) {
    return (
        <label {...props} className='LabelSecondary'>{props.children}</label>
    );
}

export default LabelSecondary;