import './ButtonSelectInput.scss';

import React from 'react';

function ButtonSelectInput(props) {

    const handleChange = (optionIdx) => {
        if (optionIdx !== props.selectedOptionIdx) props.onChange(optionIdx);
    };

    const buttons = [];
    for (let i = 0; i < props.options.length; i++) {
        buttons.push(
            <button key={i} onClick={() => handleChange(i)} className={`ButtonSelectInput__option ${i === props.selectedOptionIdx ? "ButtonSelectInput__option--selected" : ""}`}>{props.options[i]}</button>
        );
    }

    return (
        <div className='ButtonSelectInput'>
            {buttons}
            {/* <button className='ButtonSelectInput__option'>patří</button>
            <button className='ButtonSelectInput__option ButtonSelectInput__option--selected'>neúčastním se</button>
            <button className='ButtonSelectInput__option'>nepatří</button> */}
        </div>
    );
}

export default ButtonSelectInput;