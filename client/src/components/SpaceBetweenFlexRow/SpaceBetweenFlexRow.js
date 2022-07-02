import './SpaceBetweenFlexRow.scss';

import React from 'react';

// FLEX CONTAINER WITH JUSTIFY CONTENT SET TO SPACE-BETWEEN
function SpaceBetweenFlexRow(props) {
    return (
        <div className='SpaceBetweenFlexRow'>{props.children}</div>
    );
}

export default SpaceBetweenFlexRow;