import './TextInput.scss';

import React from 'react';

function TextInput(props) {
    const otherProps = {...props};
    delete otherProps.bottomMargin;

    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <input type="text" className='TextInput' style={{ marginBottom: `${bottomMargin}rem` }} {...otherProps} />
    );
}

export default TextInput;