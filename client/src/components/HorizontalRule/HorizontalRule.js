import './HorizontalRule.scss';

import React from 'react';

// HORIZONTAL RULE
function HorizontalRule(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render horizontal rule
    return (
        <hr className='HorizontalRule' style={{ marginBottom: `${bottomMargin}rem` }}/>
    );
}

export default HorizontalRule;