import './SurveyBox.scss';

import React from 'react';

function SurveyBox(props) {
    let startText;
    if (props.votes >= 5 || props.votes === 0) startText = <span><b>{props.votes}</b> zaregistrovaných uživatelů</span>;
    else if (props.votes >= 2) startText = <span><b>{props.votes}</b> zaregistrovaní uživatelé</span>;
    else startText = <span><b>{props.votes}</b> zaregistrovaný uživatel</span>;

    let cssClasses = "";
    if (props.orange) cssClasses += ' SurveyBox--orange';
    if (props.bigText) cssClasses += ' SurveyBox--big-text';

    return (
        <div className={`SurveyBox ${cssClasses}`}>{startText} {props.children}</div>
    );
}

export default SurveyBox;