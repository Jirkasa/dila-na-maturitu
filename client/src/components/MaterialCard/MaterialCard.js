import './MaterialCard.scss';

import React from 'react';
import HeadingTertiary from '../HeadingTertiary/HeadingTertiary';
import SpaceBetweenFlexRow from '../SpaceBetweenFlexRow/SpaceBetweenFlexRow';
import HeartCheckbox from '../HeartCheckbox/HeartCheckbox';
import VerticalSpace from '../VerticalSpace/VerticalSpace';
import LinkButton from '../Button/LinkButton';

// TODO - checkbox s heart ikonou zobrazovat jen pro přihlášené uživatele

function MaterialCard(props) {
    return (
        <div className='MaterialCard'>
            <div className='MaterialCard__main-side'>
                <HeadingTertiary red bottomMargin={2}>{props.title}</HeadingTertiary>
                <SpaceBetweenFlexRow>
                    <h4 className='MaterialCard__author'>{props.author}</h4>
                    <HeartCheckbox/>
                </SpaceBetweenFlexRow>
                <VerticalSpace size={4}/>
                <hr/>
                <p className='MaterialCard__material-author-text'>Zpracoval: <span className='MaterialCard__material-author'>{props.materialAuthor}</span></p>
            </div>
            <div className='MaterialCard__options-side'>
                <div className='MaterialCard__buttons'>
                    <LinkButton to={`/material/${props.id}`} iconName="icon-book">Číst</LinkButton>
                    <LinkButton to="/" iconName="icon-pencil">Test</LinkButton>
                </div>
            </div>
        </div>
    )
}

export default MaterialCard;