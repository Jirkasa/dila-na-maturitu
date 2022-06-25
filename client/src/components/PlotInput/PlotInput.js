import './PlotInput.scss';

import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PlotPartInput from '../PlotPartInput/PlotPartInput';
import { reorderList } from '../../helpers';
import Button from '../Button/Button';
import { v4 as uuid } from 'uuid';

function PlotInput(props) {

    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
    
        reorderList(
            props.plot,
            result.source.index,
            result.destination.index
        );
    
        props.updateMaterial();
    }

    function handleAddPart() {
        props.plot.push({
            id: uuid(),
            text: ""
        });

        props.updateMaterial();
    }

    function handleRemovePlotPart(idx) {
        props.plot.splice(idx, 1);
        props.updateMaterial();
    }

    function handleUpdatePlotPart(idx, text) {
        props.plot[idx].text = text;
        props.updateMaterial();
    }


    const plotPartInputs = [];
    for (let [idx, plotPart] of props.plot.entries()) {
        plotPartInputs.push(<PlotPartInput key={plotPart.id} id={plotPart.id} index={idx} text={plotPart.text} update={handleUpdatePlotPart} remove={handleRemovePlotPart}/>);
    }

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