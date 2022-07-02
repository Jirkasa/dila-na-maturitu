import './PlotPartInput.scss';

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import TextInput from '../TextInput/TextInput';
import config from '../../config';

// PLOT PART INPUT
// - represent part of PLOT INPUT
// - this part can be dragged by user to reorder plot
function PlotPartInput(props) {
    return (
        <Draggable draggableId={props.id} index={props.index}>
            {(provided) => {
                return <div className='PlotPartInput' {...provided.draggableProps} ref={provided.innerRef}>
                    <div className='PlotPartInput__drag-part' {...provided.dragHandleProps}>
                        <svg>
                            <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-drag-icon`}></use>
                        </svg>
                    </div>
                    <div className='PlotPartInput__inputs-part'>
                        <label htmlFor={`${props.id}`} className='PlotPartInput__input-label'>Popis části děje</label>
                        <TextInput onChange={(e) => props.update(props.index, e.target.value)} value={props.text} id={`${props.id}`}/>
                    </div>
                    <button className='PlotPartInput__remove-button' onClick={() => props.remove(props.index)}>
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

export default PlotPartInput;