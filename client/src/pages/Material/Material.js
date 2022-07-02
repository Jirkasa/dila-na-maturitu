import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HeadingQuaternary from '../../components/HeadingQuaternary/HeadingQuaternary';
import HeadingSecondary2 from '../../components/HeadingSecondary2/HeadingSecondary2';
import HeadingSecondary3 from '../../components/HeadingSecondary3/HeadingSecondary3';
import HeadingTertiary2 from '../../components/HeadingTertiary2/HeadingTertiary2';
import List from '../../components/List/List';
import Page from '../../components/Page/Page';
import PageLayoutLeft from '../../components/PageLayoutLeft/PageLayoutLeft';
import Paragraph from '../../components/Paragraph/Paragraph';
import ErrorPage from '../ErrorPage/ErrorPage';
import LoadPage from '../LoadPage/LoadPage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

// MATERIAL PAGE
// - displayed when user wants to read material
function Material() {
    // get material ID from params
    const {materialId} = useParams();

    // determines whether material is being loaded
    const [loading, setLoading] = useState(true);
    // determines whether Error Page should be displayed
    const [isError, setIsError] = useState(false);
    // determines whether Not Found Page should be displayed
    const [notFound, setNotFound] = useState(false);

    // here is stored material, that is displayed on page
    const [material, setMaterial] = useState(null);

    // called when page is rendered for the first time
    useEffect(() => {
        (async () => {
            try {
                // send request to get material by ID from server
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials/${materialId}`);
                // get material from response
                const mat = res.data.material;

                // store material
                setMaterial({
                    title: mat.title,
                    author: mat.author,
                    data: JSON.parse(mat.materialData),
                    materialAuthor: mat["user.username"]
                });
                // material has been loaded
                setLoading(false);
            } catch(err) {
                // if material wasn't found, Not Found Page is displayed
                if (err?.response?.status === 404) setNotFound(true);
                // if any other error has occured, Error Page is displayed
                setIsError(true);
            }
        })();
    }, []);


    // if material wasn't found, Not Found Page is rendered
    if (notFound) return <NotFoundPage/>;
    // if an error occured, Error Page is rendered
    if (isError) return <ErrorPage/>;
    // if material is being loaded, Loading Page is rendered
    if (loading) return <LoadPage/>;

    // create html to be displayed on page (material data)
    const html = [];
    // - for each section of material data
    for (let section of material.data) {
        // if section doesn't contain any parts, it is skipped
        if (section.content.length === 0) continue;

        // add section heading to be rendered on page
        html.push(<HeadingSecondary3 key={section.heading} bottomMargin={4}>{section.heading}</HeadingSecondary3>);
        
        // - for each part in section
        for (let [i, part] of section.content.entries()) {
            // based on type of part, display appropriate elements
            switch (part.type) {
                case "TEXT":
                case "TEXTAREA":
                    // for TEXT and TEXTAREA part types, display heading and paragraph
                    html.push(<HeadingTertiary2 key={`${part.name}-${part.i}`} bottomMargin={1}>{part.name}</HeadingTertiary2>);
                    html.push(<Paragraph key={`${i}-${part.name}`} bottomMargin={4}>{part.value}</Paragraph>);
                    break;
                case "CHARACTERS":
                    // for CHARACTERS part type, display heading and character names with their description
                    html.push(<HeadingTertiary2 key={`${part.name}-${part.i}`} bottomMargin={2}>{part.name}</HeadingTertiary2>);
                    // - for each character in section part
                    for (let [j, character] of part.characters.entries()) {
                        // display name and description of character
                        html.push(<HeadingQuaternary key={`${i}-${j}-${part.name}`} bottomMargin={1}>{character.name}</HeadingQuaternary>);
                        html.push(<Paragraph key={`${part.name}-${i}-${j}`} bottomMargin={j === part.characters.length-1 ? 4 : 2}>{character.description}</Paragraph>);
                    }
                    break;
                case "PLOT":
                    // for PLOT part type, display heading and list of plot parts
                    html.push(<HeadingTertiary2 key={`${part.name}-${part.i}`} bottomMargin={1}>{part.name}</HeadingTertiary2>);
                    html.push(
                        <List key={`${i}-${part.name}`} items={part.plot.map(p => p.text)} bottomMargin={4}/>
                    )
                    break;
            }
        }
    }

    // render Material page
    return (
        <Page flex>
            <PageLayoutLeft>
                <HeadingPrimary bottomMargin={2}>{material.title}</HeadingPrimary>
                <HeadingSecondary2 bottomMargin={2}>{material.author}</HeadingSecondary2>
                <Paragraph bottomMargin={6}><b>Autor materiálu: </b>{material.materialAuthor}</Paragraph>
                {html}
            </PageLayoutLeft>
        </Page>
    );
}

export default Material;