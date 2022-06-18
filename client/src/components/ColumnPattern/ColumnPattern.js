import './ColumnPattern.scss';

import React from 'react';

function ColumnPattern(props) {
    const offset = props.offset ? props.offset * 0.4 : 0;

    return (
        <div className='ColumnPattern' style={{ backgroundPositionY: `${offset}rem` }}></div>
    );
}

export default ColumnPattern;