import './HeadingQuaternary2.scss';

import React from 'react';

function HeadingQuaternary2(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <h2 className={`HeadingQuaternary2 ${props.green ? "HeadingQuaternary2--green" : ""}`} style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>
    );
}

export default HeadingQuaternary2;