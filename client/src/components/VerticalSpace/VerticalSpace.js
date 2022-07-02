import React from 'react';

// VERTICAL SPACE
// - used to add vertical space between elements
function VerticalSpace(props) {
    // calculate bottom margin
    const bottomMargin = props.size * 0.4;

    // render vertical space
    return (
        <div style={{ marginBottom: `${bottomMargin}rem` }}></div>
    );
}

export default VerticalSpace;