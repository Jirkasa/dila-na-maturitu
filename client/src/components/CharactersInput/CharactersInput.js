import './CharactersInput.scss';

import React from 'react';
import CharacterInput from '../CharacterInput/CharacterInput';
import Button from '../Button/Button';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { reorderList } from '../../helpers';
import { v4 as uuid } from 'uuid';

function CharactersInput(props) {

    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
    
        reorderList(
            props.characters,
            result.source.index,
            result.destination.index
        );
    
        props.updateMaterial();
    }

    function handleAddCharacter() {
        props.characters.push({
            id: uuid(),
            name: "",
            description: ""
        });

        props.updateMaterial();
    }

    function handleRemoveCharacter(idx) {
        props.characters.splice(idx, 1);
        props.updateMaterial();
    }

    function handleUpdateCharacterName(idx, name) {
        props.characters[idx].name = name;
        props.updateMaterial();
    }

    function handleUpdateCharacterDescription(idx, description) {
        props.characters[idx].description = description;
        props.updateMaterial();
    }


    const characterInputs = [];
    for (let [idx, character] of props.characters.entries()) {
        characterInputs.push(
            <CharacterInput
                key={character.id}
                id={character.id}
                characterName={character.name}
                characterDescription={character.description}
                index={idx}
                updateName={handleUpdateCharacterName}
                updateDescription={handleUpdateCharacterDescription}
                remove={handleRemoveCharacter}
            />);
    }

    return (
        <div className='CharactersInput' style={{ marginBottom: `${bottomMargin}rem` }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='droppable'>
                    {(provided) => {
                        return <div {...provided.droppableProps} ref={provided.innerRef}>
                            {characterInputs}
                            {provided.placeholder}
                        </div>
                    }}
                </Droppable>
            </DragDropContext>
            <Button onClick={handleAddCharacter} iconName="icon-plus" smallText>Přidat postavu</Button>
        </div>
    );
}

export default CharactersInput;