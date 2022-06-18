import './HeadingPrimary.scss';

import React from 'react';

function HeadingPrimary(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    if (props.asH2)
        return <h2 className='HeadingPrimary' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h2>;
        
    return <h1 className='HeadingPrimary' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</h1>;
}

export default HeadingPrimary;