import './HeadingQuaternary2.scss';

import React from 'react';

// HEADING QUATERNARY - 2nd version
function HeadingQuaternary2(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render quaternary heading
    return (
        <h2 className={`HeadingQuaternary2 ${props.green ? "HeadingQuaternary2--green" : ""}`} style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>
    );
}

export default HeadingQuaternary2;