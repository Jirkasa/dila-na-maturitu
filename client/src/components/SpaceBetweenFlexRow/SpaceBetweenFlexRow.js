import './SpaceBetweenFlexRow.scss';

import React from 'react';

// FLEX CONTAINER WITH JUSTIFY CONTENT SET TO SPACE-BETWEEN
function SpaceBetweenFlexRow(props) {
    return (
        <div className={`SpaceBetweenFlexRow ${props.withBreakpoint ? "SpaceBetweenFlexRow--with-breakpoint" : ""}`}>{props.children}</div>
    );
}

export default SpaceBetweenFlexRow;