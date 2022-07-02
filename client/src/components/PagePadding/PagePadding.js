import './PagePadding.scss';

import React from 'react';

// PAGE PADDING
// - wraps content into padding
function PagePadding(props) {
    return (
        <div className='PagePadding'>{props.children}</div>
    );
}

export default PagePadding;