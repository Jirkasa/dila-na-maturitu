import './SpaceBetweenFlexRow.scss';

import React from 'react';

function SpaceBetweenFlexRow(props) {
    return (
        <div className='SpaceBetweenFlexRow'>{props.children}</div>
    );
}

export default SpaceBetweenFlexRow;