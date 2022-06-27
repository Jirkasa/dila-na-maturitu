import './HeadingQuaternary.scss';

import React from 'react';

function HeadingQuaternary(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <h4 className='HeadingQuaternary' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h4>
    );
}

export default HeadingQuaternary;