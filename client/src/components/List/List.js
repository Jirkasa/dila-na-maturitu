import './List.scss';

import React from 'react';

// LIST (UL WITH LI ELEMENTS)
function List(props) {
    // create li elements
    const liElements = [];
    // - for each item in props.items array
    for (let i = 0; i < props.items.length; i++) {
        // create li element
        liElements.push(<li key={i}>{props.items[i]}</li>);
    }

    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render list
    return (
        <ul className='List' style={{ marginBottom: `${bottomMargin}rem` }}>
            {liElements}
        </ul>
    );
}

export default List;