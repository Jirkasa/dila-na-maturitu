import './RadioInput.scss';

import React from 'react';

function RadioInput(props) {
    const inputIdPrefix = props.idPrefix ? props.idPrefix : "";

    const options = props.options.map((o, idx) => {
        return (
            <div key={idx} className='RadioInput__option'>
                <input name={`${inputIdPrefix}-radio-input`} type="radio" onChange={props.onChange} id={`${inputIdPrefix}-${idx}`} value={idx} className='RadioInput__input'/>
                <label htmlFor={`${inputIdPrefix}-${idx}`} className='RadioInput__label'>{o}</label>
            </div>
        );
    });

    return (
        <div className='RadioInput'>
            {options}
        </div>
    );
}

export default RadioInput;