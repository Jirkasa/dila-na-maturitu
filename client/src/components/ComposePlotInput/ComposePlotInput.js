import './ComposePlotInput.scss';

import React from 'react';
import ComposePlotInputPart from '../ComposePlotInputPart/ComposePlotInputPart';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { reorderList } from '../../helpers';

function ComposePlotInput(props) {
    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
    
        reorderList(
            props.plot,
            result.source.index,
            result.destination.index
        );
    
        props.updateQuizData();
    }

    const plotParts = props.plot.map((plotPart, idx) => {
        return <ComposePlotInputPart key={plotPart.position} id={plotPart.position} idx={idx}>{plotPart.text}</ComposePlotInputPart>
    });

    return (
        <div className='ComposePlotInput'>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='droppable'>
                    {(provided) => {
                        return (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {plotParts}
                                {provided.placeholder}
                            </div>
                        );
                    }}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default ComposePlotInput;