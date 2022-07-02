import './TextLink.scss';

import React from 'react';
import { Link } from 'react-router-dom';

// TEXT LINK
function TextLink(props) {
    return (
        <Link {...props} className="TextLink"/>
    );
}

export default TextLink;