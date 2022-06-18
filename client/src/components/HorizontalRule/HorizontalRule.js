import './HorizontalRule.scss';

import React from 'react';

function HorizontalRule(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <hr className='HorizontalRule' style={{ marginBottom: `${bottomMargin}rem` }}/>
    );
}

export default HorizontalRule;