import React from 'react';

function VerticalSpace(props) {
    const bottomMargin = props.size * 0.4;

    return (
        <div style={{ marginBottom: `${bottomMargin}rem` }}></div>
    );
}

export default VerticalSpace;