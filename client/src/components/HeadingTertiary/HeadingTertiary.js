import './HeadingTertiary.scss';

import React from 'react';

// HEADING TERTIARY
function HeadingTertiary(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render tertiary heading as H4 if necessary
    if (props.asH4)
        return <h4 className={`HeadingTertiary ${props.red ? "HeadingTertiary--red" : ""}`} style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h4>;
    
    // render tertiary heading
    return <h3 className={`HeadingTertiary ${props.red ? "HeadingTertiary--red" : ""}`} style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h3>;
}

export default HeadingTertiary;