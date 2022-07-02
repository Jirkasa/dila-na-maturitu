import './ComposePlotInput.scss';

import React from 'react';
import ComposePlotInputPart from '../ComposePlotInputPart/ComposePlotInputPart';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { reorderList } from '../../helpers';

// COMPOSE PLOT INPUT
// - used on Test page to let user compose plot
function ComposePlotInput(props) {

    // FUNCTION to be called when user stops dragging plot parts
    function onDragEnd(result) {
        // if user dropped plot part outside of input, nothing happens
        if (!result.destination) {
            return;
        }
    
        // reorder plot based on where user dropped plot part
        reorderList(
            props.plot,
            result.source.index,
            result.destination.index
        );
    
        // update quiz data (state)
        props.updateQuizData();
    }

    // get plot parts to be rendered to the input
    const plotParts = props.plot.map((plotPart, idx) => {
        return <ComposePlotInputPart key={plotPart.position} id={plotPart.position} idx={idx}>{plotPart.text}</ComposePlotInputPart>
    });

    // render Compose Plot Input
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