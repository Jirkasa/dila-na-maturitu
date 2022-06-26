import './CenteredFlexRow.scss';

import React from 'react';

function CenteredFlexRow(props) {
    return (
        <div className={`CenteredFlexRow ${props.smallGap ? "CenteredFlexRow--small-gap" : ""}`}>{props.children}</div>
    );
}

export default CenteredFlexRow;