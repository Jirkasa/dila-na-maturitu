import './CharactersInput.scss';

import React from 'react';
import CharacterInput from '../CharacterInput/CharacterInput';
import Button from '../Button/Button';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { reorderList } from '../../helpers';
import { v4 as uuid } from 'uuid';

// CHARACTERS INPUT
// - used on Create/Edit Material page
function CharactersInput(props) {
    // calculate bottom margin
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    // FUNCTION to be called when user stops dragging characters
    function onDragEnd(result) {
        // if user dropped character outside of input, nothing happens
        if (!result.destination) {
            return;
        }
    
        // reorder characters based on where user dropped character
        reorderList(
            props.characters,
            result.source.index,
            result.destination.index
        );
    
        // update material (state)
        props.updateMaterial();
    }

    // FUNCTION to add new character
    function handleAddCharacter() {
        // add new character to characters array
        props.characters.push({
            id: uuid(),
            name: "",
            description: ""
        });

        // update material (state)
        props.updateMaterial();
    }

    // FUNCTION to remove character
    function handleRemoveCharacter(idx) {
        // remove character from characters array
        props.characters.splice(idx, 1);
        // udpate material (state)
        props.updateMaterial();
    }

    // FUNCTION to update character name
    function handleUpdateCharacterName(idx, name) {
        // update character name
        props.characters[idx].name = name;
        // update material (state)
        props.updateMaterial();
    }

    // FUNCTION to update character description
    function handleUpdateCharacterDescription(idx, description) {
        // update character description
        props.characters[idx].description = description;
        // update material (state)
        props.updateMaterial();
    }


    // get character inputs
    const characterInputs = [];
    // - for each character in characters array
    for (let [idx, character] of props.characters.entries()) {
        // create character input
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

    // render characters input
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