import './EditMaterialLayout.scss';

import React from 'react';

// LAYOUT FOR MATERIAL EDITATION
function EditMaterialLayout(props) {
    return (
        <div className='EditMaterialLayout'>
            <div className='EditMaterialLayout__left-side'>{props.leftChildren}</div>
            <div className='EditMaterialLayout__right-side'>
                <div className='EditMaterialLayout__options'>
                    {props.rightChildren}
                </div>
            </div>
        </div>
    );
}

export default EditMaterialLayout;