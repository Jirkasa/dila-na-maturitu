import './SearchBar.scss';

import React, { useState } from 'react';
import config from '../../config';

// SEARCH BAR
function SearchBar(props) {
    // here is stored text, that the user types into search bar
    const [searchText, setSearchText] = useState("");

    // FUNCTION to perform search
    const handleSubmit = (e) => {
        // prevent default behavior when form is sent
        e.preventDefault();
        // call search function with search text
        props.search(searchText);
        // clear search bar
        setSearchText("");
    }

    // render Search Bar
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