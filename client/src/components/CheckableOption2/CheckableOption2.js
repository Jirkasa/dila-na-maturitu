import './CheckableOption2.scss';

import React from 'react';
import Checkbox from '../Checkbox/Checkbox';

function CheckableOption2(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <div className='CheckableOption2' style={{ marginBottom: `${bottomMargin}rem` }}>
            <Checkbox checked={props.checked} onChange={props.onChange} id={"use_" + props.children.replaceAll(" ", "-")}/>
            <label htmlFor={"use_" + props.children.replaceAll(" ", "-")} className='CheckableOption2__label'>{props.children}</label>
        </div>
    );
}

export default CheckableOption2;