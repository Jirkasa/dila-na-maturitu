import './HeadingSecondary2.scss';

import React from 'react';

// HEADING SECONDARY - 2nd version
function HeadingSecondary2(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render secondary heading as H3 if necessary
    if (props.asH3) {
        return (
            <h3 className='HeadingSecondary2' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h3>
        );
    }

    // render secondary heading
    return (
        <h2 className='HeadingSecondary2' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>
    );
}

export default HeadingSecondary2;