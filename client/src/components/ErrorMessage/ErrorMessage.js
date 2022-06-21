import './ErrorMessage.scss';

import React from 'react';

function ErrorMessage(props) {
    return (
        <p className='ErrorMessage'>{props.children}</p>
    );
}

export default ErrorMessage;