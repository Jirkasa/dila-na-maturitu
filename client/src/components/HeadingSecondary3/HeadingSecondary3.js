import './HeadingSecondary3.scss';

import React from 'react';

// HEADING SECONDARY - 3rd version
function HeadingSecondary3(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render secondary heading
    return (
        <h2 className='HeadingSecondary3' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>
    );
}

export default HeadingSecondary3;