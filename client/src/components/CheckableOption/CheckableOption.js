import './CheckableOption.scss';

import React from 'react';
import Checkbox from '../Checkbox/Checkbox';

function CheckableOption(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    const handleCheckChange = (e) => {
        props.part.checked = e.target.checked;
        props.updateMaterial();
    }

    return (
        <div className='CheckableOption' style={{ marginBottom: `${bottomMargin}rem` }}>
            <Checkbox checked={props.part.checked} onChange={handleCheckChange} id={"use_" + props.children.replaceAll(" ", "-")}/>
            <label htmlFor={"use_" + props.children.replaceAll(" ", "-")} className='CheckableOption__label'>{props.children}</label>
        </div>
    );
}

export default CheckableOption;