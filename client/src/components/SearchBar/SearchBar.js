import './SearchBar.scss';

import React, { useState } from 'react';
import config from '../../config';

function SearchBar(props) {
    const [searchText, setSearchText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        props.search(searchText);
        setSearchText("");
    }

    return (
        <form onSubmit={handleSubmit} className='SearchBar'>
            <input type="text" onChange={(e) => setSearchText(e.target.value)} value={searchText} placeholder={props.placeholder} className='SearchBar__input'/>
            <button className='SearchBar__button'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-search`}></use>
                </svg>
                <span>Vyhledat</span>
            </button>
        </form>
    );
}

export default SearchBar;