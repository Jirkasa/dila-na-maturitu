import './HeadingSecondary.scss';

import React from 'react';

function HeadingSecondary(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <h2 className='HeadingSecondary' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>
    );
}

export default HeadingSecondary;