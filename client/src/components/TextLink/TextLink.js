import './TextLink.scss';

import React from 'react';
import { Link } from 'react-router-dom';

function TextLink(props) {
    return (
        <Link {...props} className="TextLink"/>
    );
}

export default TextLink;