import './SurveyBox.scss';

import React from 'react';

// BOX FOR SURVEY
function SurveyBox(props) {
    // get start text 
    let startText;
    if (props.votes >= 5 || props.votes === 0) startText = <span><b>{props.votes}</b> zaregistrovaných uživatelů</span>;
    else if (props.votes >= 2) startText = <span><b>{props.votes}</b> zaregistrovaní uživatelé</span>;
    else startText = <span><b>{props.votes}</b> zaregistrovaný uživatel</span>;

    // get css classes based on props
    let cssClasses = "";
    if (props.orange) cssClasses += ' SurveyBox--orange';
    if (props.bigText) cssClasses += ' SurveyBox--big-text';

    // render Survey Box
    return (
        <div className={`SurveyBox ${cssClasses}`}>{startText} {props.children}</div>
    );
}

export default SurveyBox;