import './HorizontalRuleWithText.scss';

import React from 'react';
import HorizontalRule from '../HorizontalRule/HorizontalRule';

// HORIZONTAL RULE WITH TEXT IN THE MIDDLE
function HorizontalRuleWithText(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render horizontal rule with text
    return (
        <div className='HorizontalRuleWithText' style={{ marginBottom: `${bottomMargin}rem` }}>
            <HorizontalRule/>
            <div className='HorizontalRuleWithText__text'>{props.children}</div>
            <HorizontalRule/>
        </div>
    );
}

export default HorizontalRuleWithText;