import './Form.scss';

import React from 'react';

// COMPONENT FOR FORMS
function Form(props) {
    // get props to set on form
    const otherProps = {...props};
    delete otherProps.children;

    // render form
    return (
        <div className='Form'>
            <form {...otherProps}>
                {props.children}
            </form>
        </div>
    );
}

export default Form;