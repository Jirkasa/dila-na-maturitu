import './PlotInput.scss';

import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PlotPartInput from '../PlotPartInput/PlotPartInput';
import { reorderList } from '../../helpers';
import Button from '../Button/Button';
import { v4 as uuid } from 'uuid';

// PLOT INPUT
// - used on Create/Edit Material page
function PlotInput(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

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
    
        // udpate material
        props.updateMaterial();
    }

    // FUNCTION to add plot part
    function handleAddPart() {
        // add new plot part
        props.plot.push({
            id: uuid(),
            text: ""
        });

        // update material (state)
        props.updateMaterial();
    }

    // FUNCTION to remove plot part
    function handleRemovePlotPart(idx) {
        // remove plot part
        props.plot.splice(idx, 1);
        // update material (state)
        props.updateMaterial();
    }

    // FUNCTION to update plot part
    function handleUpdatePlotPart(idx, text) {
        // update plot part
        props.plot[idx].text = text;
        // update material (state)
        props.updateMaterial();
    }


    // get Plot Part Inputs to be displayed
    const plotPartInputs = [];
    // - for each plot part
    for (let [idx, plotPart] of props.plot.entries()) {
        // get Plot Part Input
        plotPartInputs.push(<PlotPartInput key={plotPart.id} id={plotPart.id} index={idx} text={plotPart.text} update={handleUpdatePlotPart} remove={handleRemovePlotPart}/>);
    }

    // render Plot Input
    return (
        <div className='PlotInput' style={{ marginBottom: `${bottomMargin}rem` }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='droppable'>
                    {(provided) => {
                        return <div {...provided.droppableProps} ref={provided.innerRef}>
                            {plotPartInputs}
                            {provided.placeholder}
                        </div>
                    }}
                </Droppable>
            </DragDropContext>
            <Button onClick={handleAddPart} iconName="icon-plus" smallText>Přidat část</Button>
        </div>
    );
}

export default PlotInput;