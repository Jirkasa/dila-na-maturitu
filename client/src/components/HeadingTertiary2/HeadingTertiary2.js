import './HeadingTertiary2.scss';

import React from 'react';

// HEADING TERTIARY - 2nd version
function HeadingTertiary2(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render tertiary heading
    return (
        <h3 className='HeadingTertiary2' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h3>
    );
}

export default HeadingTertiary2;