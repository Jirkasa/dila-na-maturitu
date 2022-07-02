import './InputDescription.scss';

import React from 'react';

// INPUT DESCRIPTION
// - used in forms to hold label and error message for input
function InputDescription(props) {
    return (
        <div className='InputDescription'>{props.children}</div>
    );
}

export default InputDescription;