import './Paragraph.scss';

import React from 'react';

function Paragraph(props) {

    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <p className='Paragraph' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</p>
    );
}

export default Paragraph;