import './TextArea.scss';

import React from 'react';

function TextArea(props) {
    const otherProps = {...props};
    delete otherProps.bottomMargin;

    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <textarea className='TextArea' {...otherProps} style={{ marginBottom: `${bottomMargin}rem` }}></textarea>
    )
}

export default TextArea;