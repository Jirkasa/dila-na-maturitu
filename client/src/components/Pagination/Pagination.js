import './Pagination.scss';

import React from 'react';
import PaginationButton from '../PaginationButton/PaginationButton';
import config from '../../config';

function Pagination(props) {

    const pageSelect = (e) => props.selectPage(+e.target.innerText);

    let offset = 0;
    if (props.activePage > config.PAGINATION_BUTTONS_COUNT/2 && props.pageCount > config.PAGINATION_BUTTONS_COUNT) {
        if (props.activePage > (props.pageCount - Math.floor(config.PAGINATION_BUTTONS_COUNT/2)-1)) {
            offset = props.activePage - (config.PAGINATION_BUTTONS_COUNT-(props.pageCount-props.activePage));
        } else {
            offset = props.activePage - Math.floor(config.PAGINATION_BUTTONS_COUNT/2)-1;
        }
    }

    const paginationButtons = [];
    for (let i = 1; i <= config.PAGINATION_BUTTONS_COUNT && i <= props.pageCount; i++) {
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

        let number;
        if (i === 1) {
            number = 1;
        } else if (i === config.PAGINATION_BUTTONS_COUNT) {
            number = props.pageCount;
        } else {
            number = i+offset;
        }

        paginationButtons.push(<PaginationButton onClick={pageSelect} key={i} active={props.activePage === i+offset}>{number}</PaginationButton>)
    }

    return (
        <div className='Pagination'>
            <button onClick={props.selectPrevPage} disabled={props.activePage === 1} className='Pagination__move-button'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-arrow-left2`}></use>
                </svg>
            </button>
            {paginationButtons}
            <button onClick={props.selectNextPage} disabled={props.activePage === props.pageCount} className='Pagination__move-button'>
                <svg>
                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-arrow-right2`}></use>
                </svg>
            </button>
        </div>
    );
}

export default Pagination;