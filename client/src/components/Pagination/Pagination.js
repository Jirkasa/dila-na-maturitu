import './Pagination.scss';

import React from 'react';
import PaginationButton from '../PaginationButton/PaginationButton';
import config from '../../config';

// PAGINATION COMPONENT
// used in Materials and similar pages
function Pagination(props) {

    // FUNCTION that is called when user selects page
    const pageSelect = (e) => props.selectPage(+e.target.innerText);


    // get offset (basically what is the first button page number)
    let offset = 0;
    if (props.activePage > config.PAGINATION_BUTTONS_COUNT/2 && props.pageCount > config.PAGINATION_BUTTONS_COUNT) {
        if (props.activePage > (props.pageCount - Math.floor(config.PAGINATION_BUTTONS_COUNT/2)-1)) {
            offset = props.activePage - (config.PAGINATION_BUTTONS_COUNT-(props.pageCount-props.activePage));
        } else {
            offset = props.activePage - Math.floor(config.PAGINATION_BUTTONS_COUNT/2)-1;
        }
    }

    // create pagination buttons
    const paginationButtons = [];
    for (let i = 1; i <= config.PAGINATION_BUTTONS_COUNT && i <= props.pageCount; i++) {
        // display disable [...] button if necessary
        if (
            (
                i === 2 &&
                props.activePage > Math.ceil(config.PAGINATION_BUTTONS_COUNT/2) &&
                props.pageCount > config.PAGINATION_BUTTONS_COUNT
            ) || (
                i === config.PAGINATION_BUTTONS_COUNT-1 &&
                props.activePage < props.pageCount - Math.floor(config.PAGINATION_BUTTONS_COUNT/2) &&
                props.pageCount > config.PAGINATION_BUTTONS_COUNT
            )
        ) {
            paginationButtons.push(<PaginationButton key={i} disabled>...</PaginationButton>);
            continue;
        }

        // get number of current button
        let number;
        if (i === 1) {
            // first button has always number 1
            number = 1;
        } else if (i === config.PAGINATION_BUTTONS_COUNT) {
            // last number has always number as page count
            number = props.pageCount;
        } else {
            // number is sum of index and offset
            number = i+offset;
        }

        // add button to pagination buttons array
        paginationButtons.push(<PaginationButton onClick={pageSelect} key={i} active={props.activePage === i+offset}>{number}</PaginationButton>)
    }

    // render Pagination
    return (
        <div className='Pagination'>
            <button onClick={props.selectPrevPage} disabled={props.activePage <= 1} className='Pagination__move-button'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-arrow-left2`}></use>
                </svg>
            </button>
            {paginationButtons}
            <button onClick={props.selectNextPage} disabled={props.activePage >= props.pageCount} className='Pagination__move-button'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-arrow-right2`}></use>
                </svg>
            </button>
        </div>
    );
}

export default Pagination;