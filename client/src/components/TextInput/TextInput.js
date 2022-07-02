import './TextInput.scss';

import React from 'react';

// TEXT INPUT
function TextInput(props) {
    // get props to be passed to input element
    const otherProps = {...props};
    delete otherProps.bottomMargin;

    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render Text Input
    return (
        <input type="text" className='TextInput' style={{ marginBottom: `${bottomMargin}rem` }} {...otherProps} />
    );
}

export default TextInput;