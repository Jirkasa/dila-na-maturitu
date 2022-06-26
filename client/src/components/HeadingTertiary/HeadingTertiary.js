import './HeadingTertiary.scss';

import React from 'react';

function HeadingTertiary(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    if (props.asH4)
        return <h4 className={`HeadingTertiary ${props.red ? "HeadingTertiary--red" : ""}`} style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h4>;
        
    return <h3 className={`HeadingTertiary ${props.red ? "HeadingTertiary--red" : ""}`} style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h3>;
}

export default HeadingTertiary;