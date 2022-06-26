import './PaginationButton.scss';

import React from 'react';

function PaginationButton(props) {
    return (
        <button onClick={props.onClick} disabled={props.disabled} className={`PaginationButton ${props.active ? "PaginationButton--active" : ""}`}>{props.children}</button>
    );
}

export default PaginationButton;