import './ErrorMessage.scss';

import React from 'react';

// REPRESENTS ERROR MESSAGE (usually in form)
function ErrorMessage(props) {
    return (
        <p className='ErrorMessage'>{props.children}</p>
    );
}

export default ErrorMessage;