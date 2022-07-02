import './ColumnPattern.scss';

import React from 'react';

// REPRESENTS COLUMN PATTERN
// - used as decoration on page sides
function ColumnPattern(props) {
    // calculate offset of column pattern
    const offset = props.offset ? props.offset * 0.4 : 0;

    // render column pattern
    return (
        <div className='ColumnPattern' style={{ backgroundPositionY: `${offset}rem` }}></div>
    );
}

export default ColumnPattern;