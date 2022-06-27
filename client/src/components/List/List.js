import './List.scss';

import React from 'react';

function List(props) {
    const liElements = [];
    for (let i = 0; i < props.items.length; i++) {
        liElements.push(<li key={i}>{props.items[i]}</li>);
    }

    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <ul className='List' style={{ marginBottom: `${bottomMargin}rem` }}>
            {liElements}
        </ul>
    );
}

export default List;