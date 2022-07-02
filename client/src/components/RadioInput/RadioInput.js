import './RadioInput.scss';

import React from 'react';

// RADIO INPUT
// - takes array of options as prop and renders radio inputs that allows user to select one option
function RadioInput(props) {
    // get input id prefix (to add htmlFor attributes to label elements and also to be used as name of radio inputs)
    const inputIdPrefix = props.idPrefix ? props.idPrefix : "";

    // create option elements
    const options = props.options.map((o, idx) => {
        return (
            <div key={idx} className='RadioInput__option'>
                <input name={`${inputIdPrefix}-radio-input`} type="radio" onChange={props.onChange} id={`${inputIdPrefix}-${idx}`} value={idx} className='RadioInput__input'/>
                <label htmlFor={`${inputIdPrefix}-${idx}`} className='RadioInput__label'>{o}</label>
            </div>
        );
    });

    // render radio input
    return (
        <div className='RadioInput'>
            {options}
        </div>
    );
}

export default RadioInput;