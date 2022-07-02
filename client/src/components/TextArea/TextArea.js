import './TextArea.scss';

import React from 'react';

// TEXT AREA
function TextArea(props) {
    // get props to be passed to textarea element
    const otherProps = {...props};
    delete otherProps.bottomMargin;

    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render Text Area
    return (
        <textarea className='TextArea' {...otherProps} style={{ marginBottom: `${bottomMargin}rem` }}></textarea>
    )
}

export default TextArea;