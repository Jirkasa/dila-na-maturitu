import './SelectInput.scss';

import React from 'react';

function SelectInput(props) {
    const otherProps = {...props};
    delete otherProps.options;

    const options = props.options.map((option, idx) => {
        return <option key={idx} value={idx}>{option}</option>
    });

    return (
        <select {...otherProps} className='SelectInput'>{options}</select>
    );
}

export default SelectInput;