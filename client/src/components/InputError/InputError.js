import './InputError.scss';

import React from 'react';

function InputError(props) {
    return (
        <span className='InputError'>{props.children}</span>
    );
}

export default InputError;