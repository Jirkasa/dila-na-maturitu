import './CheckableOption.scss';

import React from 'react';
import Checkbox from '../Checkbox/Checkbox';

// CHECKABLE OPTION
// - used on Create/Edit material pages to control which section parts are displayed
function CheckableOption(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // FUNCTION that is called when checkbox is changed
    const handleCheckChange = (e) => {
        // update checked property of material part
        props.part.checked = e.target.checked;
        // udpate material (state)
        props.updateMaterial();
    }

    // render Checkable Option
    return (
        <div className='CheckableOption' style={{ marginBottom: `${bottomMargin}rem` }}>
            <Checkbox checked={props.part.checked} onChange={handleCheckChange} id={"use_" + props.children.replaceAll(" ", "-")}/>
            <label htmlFor={"use_" + props.children.replaceAll(" ", "-")} className='CheckableOption__label'>{props.children}</label>
        </div>
    );
}

export default CheckableOption;