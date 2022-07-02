import './ComposePlotInputPart.scss';

import React from 'react';
import Paragraph from '../Paragraph/Paragraph';
import config from '../../config';
import { Draggable } from 'react-beautiful-dnd';

// COMPOSE PLOT INPUT PART
// - represents part of COMPOSE PLOT INPUT
// - this part can be dragged by user to reorder plot
function ComposePlotInputPart(props) {
    return (
        <Draggable draggableId={""+props.id} index={props.idx}>
            {(provided) => {
                return (
                    <div className='ComposePlotInputPart' {...provided.draggableProps} ref={provided.innerRef}>
                        <div {...provided.dragHandleProps} className='ComposePlotInputPart__drag-part'>
                            <svg>
                                <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-drag-icon`}></use>
                            </svg>
                        </div>
                        <div className='ComposePlotInputPart__text-part'>
                            <Paragraph>{props.children}</Paragraph>
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
}

export default ComposePlotInputPart;