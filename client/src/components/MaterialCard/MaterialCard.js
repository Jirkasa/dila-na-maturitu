import './MaterialCard.scss';

import React from 'react';
import HeadingTertiary from '../HeadingTertiary/HeadingTertiary';
import SpaceBetweenFlexRow from '../SpaceBetweenFlexRow/SpaceBetweenFlexRow';
import HeartCheckbox from '../HeartCheckbox/HeartCheckbox';
import VerticalSpace from '../VerticalSpace/VerticalSpace';
import LinkButton from '../Button/LinkButton';
import { Link } from 'react-router-dom';
import config from '../../config';
import Button from '../Button/Button';

function MaterialCard(props) {

    const handleLikeCheck = (e) => {
        if (e.target.checked) {
            props.like(props.id);
        } else {
            props.unlike(props.id);
        }
    }

    return (
        <div className='MaterialCard'>
            <div className='MaterialCard__main-side'>
                <HeadingTertiary red bottomMargin={2}>{props.title}</HeadingTertiary>
                <SpaceBetweenFlexRow>
                    <h4 className='MaterialCard__author'>{props.author}</h4>
                    {props.showLikeOption && <HeartCheckbox checked={props.liked} onChange={handleLikeCheck}/>}
                </SpaceBetweenFlexRow>
                <VerticalSpace size={4}/>
                <hr/>
                <p className='MaterialCard__material-author-text'>Zpracoval: <span className='MaterialCard__material-author'>{props.materialAuthor}</span></p>
            </div>
            <div className='MaterialCard__options-side'>
                {
                    props.showOptions && (
                        <div className='MaterialCard__options'>
                            <Link to={`/editace-materialu/${props.id}`} className='MaterialCard__option MaterialCard__option--edit'>
                                <svg>
                                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-edit`}></use>
                                </svg>
                                <span>Editovat</span>
                            </Link>
                            <Link to={`/editace-spatnych-odpovedi/${props.id}`} className='MaterialCard__option MaterialCard__option--answers'>
                                <svg>
                                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-comment-o`}></use>
                                </svg>
                                <span>Odpovědi</span>
                            </Link>
                            <Link to={`/smazani-materialu/${props.id}`} className='MaterialCard__option'>
                                <svg>
                                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-bin`}></use>
                                </svg>
                                <span>Smazat</span>
                            </Link>
                        </div>
                    )
                }
                <div className='MaterialCard__buttons'>
                    <LinkButton to={`/material/${props.id}`} iconName="icon-book">Číst</LinkButton>
                    {
                        props.testable
                        ? <LinkButton to={`/test/${props.id}`} iconName="icon-pencil">Test</LinkButton>
                        : <Button disabled iconName="icon-pencil">Test</Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default MaterialCard;