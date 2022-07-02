import './PageLayoutCentered.scss';

import React from 'react';
import ColumnPattern from '../ColumnPattern/ColumnPattern';

// CENTERED PAGE LAYOUT
function PageLayoutCentered(props) {
    return (
        <div className='PageLayoutCentered'>
            <div>
                <ColumnPattern offset={4}/>
                <div className='PageLayoutCentered__content'>
                    {props.children}
                </div>
                <ColumnPattern offset={4}/>
            </div>
        </div>
    );
}

export default PageLayoutCentered;