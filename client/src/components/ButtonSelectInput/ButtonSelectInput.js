import './ButtonSelectInput.scss';

import React from 'react';

// REPRESENTS BUTTON SELECT INPUT
// user can select one of specified buttons
function ButtonSelectInput(props) {

    // FUNCTION to handle button clicks
    const handleChange = (optionIdx) => {
        if (optionIdx !== props.selectedOptionIdx) props.onChange(optionIdx);
    };

    // create button elements
    const buttons = [];
    // - for each specified option
    for (let i = 0; i < props.options.length; i++) {
        // create button
        buttons.push(
            <button key={i} onClick={() => handleChange(i)} className={`ButtonSelectInput__option ${i === props.selectedOptionIdx ? "ButtonSelectInput__option--selected" : ""}`}>{props.options[i]}</button>
        );
    }

    // render Button Select Input
    return (
        <div className='ButtonSelectInput'>
            {buttons}
        </div>
    );
}

export default ButtonSelectInput;