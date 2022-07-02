import './HeadingPrimary.scss';

import React from 'react';

// HEADING PRIMARY
function HeadingPrimary(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render primary heading as H2 if necessary
    if (props.asH2)
        return <h2 className='HeadingPrimary' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>;
    
    // render primary heading
    return <h1 className='HeadingPrimary' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h1>;
}

export default HeadingPrimary;