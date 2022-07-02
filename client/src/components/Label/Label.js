import './Label.scss';

import React from 'react';

// LABEL
// - used to label inputs
function Label(props) {
    // get props to be added to label
    const otherProps = {...props};
    delete otherProps.children;

    return (
        <label {...otherProps} className="Label">{props.children}</label>
    );
}

export default Label;