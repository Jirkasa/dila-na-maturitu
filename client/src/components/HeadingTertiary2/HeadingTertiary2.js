import './HeadingTertiary2.scss';

import React from 'react';

function HeadingTertiary2(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <h3 className='HeadingTertiary2' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h3>
    );
}

export default HeadingTertiary2;