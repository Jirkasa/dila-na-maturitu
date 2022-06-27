import './HeadingSecondary2.scss';

import React from 'react';

function HeadingSecondary2(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <h2 className='HeadingSecondary2' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>
    );
}

export default HeadingSecondary2;