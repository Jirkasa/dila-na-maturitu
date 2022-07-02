import './CheckableOption2.scss';

import React from 'react';
import Checkbox from '../Checkbox/Checkbox';

// CHECKABLE OPTION - 2nd version
// - used on Test page to choose which parts are included in test (but it is possible to use it somewhere else)
function CheckableOption2(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render Checkable Option
    return (
        <div className='CheckableOption2' style={{ marginBottom: `${bottomMargin}rem` }}>
            <Checkbox checked={props.checked} onChange={props.onChange} id={"use_" + props.children.replaceAll(" ", "-")}/>
            <label htmlFor={"use_" + props.children.replaceAll(" ", "-")} className='CheckableOption2__label'>{props.children}</label>
        </div>
    );
}

export default CheckableOption2;