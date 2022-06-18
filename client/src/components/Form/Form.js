import './Form.scss';

import React from 'react';

function Form(props) {
    const otherProps = {...props};
    delete otherProps.children;

    return (
        <div className='Form'>
            <form {...otherProps}>
                {props.children}
            </form>
        </div>
    );
}

export default Form;