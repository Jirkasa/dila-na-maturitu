import './HeadingSecondary.scss';

import React from 'react';

// HEADING SECONDARY
function HeadingSecondary(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render secondary heading
    return (
        <h2 className='HeadingSecondary' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>
    );
}

export default HeadingSecondary;