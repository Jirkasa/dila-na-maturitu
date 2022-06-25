import './PagePadding.scss';

import React from 'react';

function PagePadding(props) {
    return (
        <div className='PagePadding'>{props.children}</div>
    );
}

export default PagePadding;