import './SelectInput.scss';

import React from 'react';

// SELECT INPUT
// - takes array of options as prop named options
function SelectInput(props) {
    // get props to be set on select element
    const otherProps = {...props};
    delete otherProps.options;

    // create option elements
    const options = props.options.map((option, idx) => {
        return <option key={idx} value={idx}>{option}</option>
    });

    // render select element with option elements
    return (
        <select {...otherProps} className='SelectInput'>{options}</select>
    );
}

export default SelectInput;