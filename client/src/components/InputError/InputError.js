import './InputError.scss';

import React from 'react';

// INPUT ERROR
// - used to display error for input
function InputError(props) {
    return (
        <span className='InputError'>{props.children}</span>
    );
}

export default InputError;