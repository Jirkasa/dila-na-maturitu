import './VideoSection.scss';

import React from 'react';
import config from '../../config';
import HeadingTertiary from '../../components/HeadingTertiary/HeadingTertiary';
import ALinkButton from '../../components/Button/ALinkButton';

function VideoSection(props) {

    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    return (
        <div className='VideoSection' style={{ marginBottom: `${bottomMargin}rem` }}>
            <a href={props.videoURL} target="_blank" className='VideoSection__video'>
                <img src="/img/video-pattern.svg" className='VideoSection__video-pattern VideoSection__video-pattern--left'/>
                <div className='VideoSection__video-icon'>
                    <svg>
                        <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-youtube`}></use>
                    </svg>
                </div>
                <span>Přehrát video</span>
                <img src="/img/video-pattern.svg" className='VideoSection__video-pattern'/>
            </a>
            <div className='VideoSection__content'>
                <div>
                    <h3 className='VideoSection__title'>{props.title}</h3>
                    <HeadingTertiary bottomMargin={6} asH4>{props.author}</HeadingTertiary>
                    <div className='VideoSection__icon'>
                        <svg>
                            <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-file-play`}></use>
                        </svg>
                    </div>
                </div>
                <ALinkButton iconName="icon-download2" smallText to={props.worksheetURL}>Stáhnout pracovní list</ALinkButton>
            </div>
        </div>
    );
}

export default VideoSection;