import './Paragraph.scss';

import React from 'react';

// PARAGRAPH
function Paragraph(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // render paragraph
    return (
        <p className='Paragraph' style={{ marginBottom: `${bottomMargin}rem` }}>{props.children}</p>
    );
}

export default Paragraph;