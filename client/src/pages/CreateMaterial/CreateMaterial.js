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

function CreateMaterial() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [material, setMaterial] = useState(getInitialMaterialSetup());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateMaterial = () => {
        const newMaterial = [...material];
        setMaterial(newMaterial);
    }

    const setValueOfMaterialPart = (partObj, newValue) => {
        partObj.value = newValue;
        updateMaterial();
    }

    const saveMaterial = async () => {
        if (loading) return;

        try {
            setError(null);
            setLoading(true);

            const materialData = cloneDeep(material);
            for (let section of materialData) {
                for (let i = section.content.length-1; i >= 0; i--) {
                    if (!section.content[i].checked) {
                        section.content.splice(i, 1);
                    }
                }
            }

            await axios.post(`${process.env.REACT_APP_API_URL}/materials`, {
                title: title,
                author: author,
                materialData: JSON.stringify(materialData)
            }, auth.getHeaderConfig());
            navigate("/moje-materialy");
        } catch(err) {
            const errData = err.response.data;
            if (errData.error) setError(errData.error);

            setLoading(false);
        }
    }


    const optionsSideElements = [];
    const inputSideElements = [];

    for (const section of material) {
        optionsSideElements.push(<HeadingTertiary bottomMargin={2} key={section.heading}>{section.heading}</HeadingTertiary>);
        inputSideElements.push(<HeadingTertiary bottomMargin={1} key={section.heading}>{section.heading}</HeadingTertiary>);
        let noPartInSection = true;
        for (const [i, part] of section.content.entries()) {
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

            if (part.checked) {
                inputSideElements.push(<LabelSecondary htmlFor={part.name.replaceAll(" ", "-")} key={`label-${part.name}`}>{part.name}</LabelSecondary>)
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
                noPartInSection = false;
            }
        }
        if (noPartInSection) {
            inputSideElements.push(<Paragraph key={`no-part-${section.heading}`}>Pro tuto sekci není vybrána žádná část.</Paragraph>);
        }
        inputSideElements.push(<VerticalSpace key={`bottom-margin-${section.heading}`} size={4}/>);
    }

    return (
        <Page>
            <PagePadding>
                <CenteredText>
                    <HeadingPrimary bottomMargin={6}>Vytvoření materiálu</HeadingPrimary>
                </CenteredText>
                <EditMaterialLayout
                    leftChildren={
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
                    rightChildren={
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