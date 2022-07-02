import './CheckableInput.scss';

import React from 'react';
import Checkbox from '../Checkbox/Checkbox';
import TextInput from '../TextInput/TextInput';

// CHECKABLE INPUT
// - onChange prop can be passed to run function when input is changed
//      - this function should take as parameter object (this object has property checked and value)
function CheckableInput(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render checkable input (checkbox and text input)
    // - text input is disabled based on value of prop checked
    // - text input value is determined by prop value
    return (
        <div className='CheckableInput' style={{ marginBottom: `${bottomMargin}rem` }}>
            <Checkbox checked={props.checked} onChange={(e) => props.onChange({
                checked: e.target.checked,
                value: props.value
            })}/>
            <TextInput value={props.value} disabled={!props.checked} onChange={(e) => props.onChange({
                checked: props.checked,
                value: e.target.value
            })}/>
        </div>
    );
}

export default CheckableInput;