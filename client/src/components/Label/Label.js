import './Label.scss';

import React from 'react';

function Label(props) {
    const otherProps = {...props};
    delete otherProps.children;

    return (
        <label {...otherProps} className="Label">{props.children}</label>
    );
}

export default Label;