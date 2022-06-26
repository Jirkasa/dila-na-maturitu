import './PageLayoutLeft.scss';

import React from 'react';
import ColumnPattern from '../ColumnPattern/ColumnPattern';

function PageLayoutLeft(props) {
    return (
        <div className='PageLayoutLeft'>
            <div>
                <div className='PageLayoutLeft__content'>
                    {props.children}
                </div>
                <ColumnPattern offset={4}/>
            </div>
        </div>
    );
}

export default PageLayoutLeft;