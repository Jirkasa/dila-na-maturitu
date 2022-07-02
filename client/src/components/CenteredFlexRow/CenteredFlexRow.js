import './CenteredFlexRow.scss';

import React from 'react';

// COMPONENT TO WRAP ELEMENTS INTO FLEX CONTAINER
// - components are centered
function CenteredFlexRow(props) {
    return (
        <div className={`CenteredFlexRow ${props.smallGap ? "CenteredFlexRow--small-gap" : ""}`}>{props.children}</div>
    );
}

export default CenteredFlexRow;