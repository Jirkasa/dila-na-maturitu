import './CharacterInput.scss';

import React from 'react';
import config from '../../config';
import TextInput from '../TextInput/TextInput';
import { Draggable } from 'react-beautiful-dnd';

function CharacterInput(props) {

    return (
        <Draggable draggableId={props.id} index={props.index}>
            {(provided) => {
                return <div className='CharacterInput' {...provided.draggableProps} ref={provided.innerRef}>
                    <div className='CharacterInput__drag-part' {...provided.dragHandleProps}>
                        <svg>
                            <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-drag-icon`}></use>
                        </svg>
                    </div>
                    <div className='CharacterInput__inputs-part'>
                        <label htmlFor={`${props.id}-name`} className='CharacterInput__input-label'>Jméno postavy</label>
                        <TextInput onChange={(e) => props.updateName(props.index, e.target.value)} id={`${props.id}-name`} value={props.characterName} bottomMargin={2}/>
                        <label htmlFor={`${props.id}-description`} className='CharacterInput__input-label'>Popis postavy</label>
                        <TextInput onChange={(e) => props.updateDescription(props.index, e.target.value)} id={`${props.id}-description`} value={props.characterDescription}/>
                    </div>
                    <button className='CharacterInput__remove-button' onClick={() => props.remove(props.index)}>
                        <svg>
                            <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-cross`}></use>
                        </svg>
                        <span>odstranit</span>
                    </button>
                </div>
            }}
        </Draggable>
    );
}

export default CharacterInput;