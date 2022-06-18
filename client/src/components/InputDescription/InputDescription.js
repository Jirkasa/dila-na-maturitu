import './InputDescription.scss';

import React from 'react';

function InputDescription(props) {
    return (
        <div className='InputDescription'>{props.children}</div>
    );
}

export default InputDescription;