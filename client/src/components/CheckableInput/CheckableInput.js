import './CheckableInput.scss';

import React, { useState } from 'react';
import Checkbox from '../Checkbox/Checkbox';
import TextInput from '../TextInput/TextInput';

function CheckableInput(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

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