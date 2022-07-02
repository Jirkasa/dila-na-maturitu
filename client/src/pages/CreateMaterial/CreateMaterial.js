import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import CenteredText from '../../components/CenteredText/CenteredText';
import CharactersInput from '../../components/CharactersInput/CharactersInput';
import CheckableOption from '../../components/CheckableOption/CheckableOption';
import EditMaterialLayout from '../../components/EditMaterialLayout/EditMaterialLayout';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HeadingSecondary from '../../components/HeadingSecondary/HeadingSecondary';
import HeadingTertiary from '../../components/HeadingTertiary/HeadingTertiary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import LabelSecondary from '../../components/LabelSecondary/LabelSecondary';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import Page from '../../components/Page/Page';
import PagePadding from '../../components/PagePadding/PagePadding';
import Paragraph from '../../components/Paragraph/Paragraph';
import PlotInput from '../../components/PlotInput/PlotInput';
import TextArea from '../../components/TextArea/TextArea';
import TextInput from '../../components/TextInput/TextInput';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';
import { useAuth } from '../../contexts/AuthContext';
import { getInitialMaterialSetup } from '../../helpers';
import { cloneDeep } from 'lodash';

// CREATE MATERIAL PAGE
function CreateMaterial() {
    const auth = useAuth();
    const navigate = useNavigate();


    // material data
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [material, setMaterial] = useState(getInitialMaterialSetup());
    // determines whether material is being sent to server to be saved
    const [loading, setLoading] = useState(false);
    // stores error message if an error occures
    const [error, setError] = useState(null);

    // FUNCTION to update material (state) after change of material
    const updateMaterial = () => {
        // just create new array and set it to state
        const newMaterial = [...material];
        setMaterial(newMaterial);
    }

    // FUNCTION to set value of material part
    const setValueOfMaterialPart = (partObj, newValue) => {
        // set value property of part object in material to new value
        partObj.value = newValue;
        // update material state
        updateMaterial();
    }

    // FUNCTION to save material to server
    const saveMaterial = async () => {
        // while material is being sent to server, user can't send it again
        if (loading) return;

        try {
            // material is being sent to server
            setError(null);
            setLoading(true);

            // prepare material data to be sent to server
            // - create deep copy of material object
            const materialData = cloneDeep(material);
            // - for each section of copied material data
            for (let section of materialData) {
                // for each part of section (start from end)
                for (let i = section.content.length-1; i >= 0; i--) {
                    // if part is not checked, remove it
                    if (!section.content[i].checked) {
                        section.content.splice(i, 1);
                    }
                }
            }

            // send material to server
            await axios.post(`${process.env.REACT_APP_API_URL}/materials`, {
                title: title,
                author: author,
                materialData: JSON.stringify(materialData)
            }, auth.getHeaderConfig());
            // material was succesfully created, user is redirected to My Materials page
            navigate("/moje-materialy");
        } catch(err) {
            // if error occurs, error message is set
            const errData = err.response.data;
            if (errData.error) setError(errData.error);

            // material is no longer being sent to server
            setLoading(false);
        }
    }


    // here will be stored elements to be rendered on options side of page
    const optionsSideElements = [];
    // here will be stored elements to be rendered on input side of page
    const inputSideElements = [];

    // for each section of material data
    for (const section of material) {
        // add section headings to both sides of page
        optionsSideElements.push(<HeadingTertiary bottomMargin={2} key={section.heading}>{section.heading}</HeadingTertiary>);
        inputSideElements.push(<HeadingTertiary bottomMargin={1} key={section.heading}>{section.heading}</HeadingTertiary>);
        
        // determines whether there are no parts selected for this section
        let noPartInSection = true;
        // for each part of section
        for (const [i, part] of section.content.entries()) {
            // add checkable option to options side for this section part
            optionsSideElements.push(
                <CheckableOption
                    bottomMargin={i === section.content.length-1 ? 4 : 2}
                    key={part.name}
                    part={part}
                    updateMaterial={updateMaterial}
                >
                    {part.name}
                </CheckableOption>
            );

            // if section part is checked, input is added to be rendered on inputs side of page
            if (part.checked) {
                // add label for input
                inputSideElements.push(<LabelSecondary htmlFor={part.name.replaceAll(" ", "-")} key={`label-${part.name}`}>{part.name}</LabelSecondary>);
                // add input based on type of section part
                switch (part.type) {
                    case "TEXT":
                        inputSideElements.push(<TextInput onChange={(e) => setValueOfMaterialPart(part, e.target.value)} value={part.value} id={part.name.replaceAll(" ", "-")} bottomMargin={2} key={`input-${part.name}`}/>);
                        break;
                    case "TEXTAREA":
                        inputSideElements.push(<TextArea onChange={(e) => setValueOfMaterialPart(part, e.target.value)} value={part.value} id={part.name.replaceAll(" ", "-")} rows={part.textAreaRows} bottomMargin={2} key={`input-${part.name}`}/>);
                        break;
                    case "CHARACTERS":
                        inputSideElements.push(<CharactersInput updateMaterial={updateMaterial} key={`input-${part.name}`} characters={part.characters} bottomMargin={2}/>);
                        break;
                    case "PLOT":
                        inputSideElements.push(<PlotInput updateMaterial={updateMaterial} key={`input-${part.name}`} plot={part.plot} bottomMargin={2}/>)
                        break;
                }
                // set that there is at least one part selected in this section
                noPartInSection = false;
            }
        }
        // if there are no parts selected in this section, information text is displayed
        if (noPartInSection) {
            inputSideElements.push(<Paragraph key={`no-part-${section.heading}`}>Pro tuto sekci není vybrána žádná část.</Paragraph>);
        }
        // add vertical space between inputs
        inputSideElements.push(<VerticalSpace key={`bottom-margin-${section.heading}`} size={4}/>);
    }

    // render Create Material page
    return (
        <Page>
            <PagePadding>
                <CenteredText>
                    <HeadingPrimary bottomMargin={6}>Vytvoření materiálu</HeadingPrimary>
                </CenteredText>
                <EditMaterialLayout
                    leftChildren={ // inputs side
                        <>
                            <LabelSecondary htmlFor="nazev-dila">Název díla</LabelSecondary>
                            <TextInput onChange={(e) => setTitle(e.target.value)} id="nazev-dila" bottomMargin={2}/>
                            <LabelSecondary htmlFor="autor">Autor</LabelSecondary>
                            <TextInput onChange={(e) => setAuthor(e.target.value)} id="autor" bottomMargin={4}/>
                            {inputSideElements}
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            <CenteredText>
                                {
                                    loading
                                    ? <LoadIcon small/>
                                    : <Button onClick={saveMaterial}>Uložit materiál</Button>
                                }
                            </CenteredText>
                        </>
                    }
                    rightChildren={ // options side
                        <>
                            <HeadingSecondary bottomMargin={2}>Části materiálu</HeadingSecondary>
                            <HorizontalRule bottomMargin={4}/>
                            {optionsSideElements}
                        </>
                    }
                />
            </PagePadding>
        </Page>
    );
}

export default CreateMaterial;