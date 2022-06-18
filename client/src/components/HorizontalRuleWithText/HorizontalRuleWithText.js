import './HorizontalRuleWithText.scss';

import React from 'react';
import HorizontalRule from '../HorizontalRule/HorizontalRule';

function HorizontalRuleWithText(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <div className='HorizontalRuleWithText' style={{ marginBottom: `${bottomMargin}rem` }}>
            <HorizontalRule/>
            <div className='HorizontalRuleWithText__text'>{props.children}</div>
            <HorizontalRule/>
        </div>
    );
}

export default HorizontalRuleWithText;