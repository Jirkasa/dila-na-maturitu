import './HeadingQuaternary.scss';

import React from 'react';

// HEADING QUATERNARY
function HeadingQuaternary(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render quaternary-heading
    return (
        <h4 className='HeadingQuaternary' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h4>
    );
}

export default HeadingQuaternary;