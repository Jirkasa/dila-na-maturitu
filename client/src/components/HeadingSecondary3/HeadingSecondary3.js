import './HeadingSecondary3.scss';

import React from 'react';

function HeadingSecondary3(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <h2 className='HeadingSecondary3' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>
    );
}

export default HeadingSecondary3;