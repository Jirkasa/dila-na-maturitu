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
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';
import ErrorPage from '../ErrorPage/ErrorPage';
import LoadPage from '../LoadPage/LoadPage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

function Material() {
    const {materialId} = useParams();

    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [material, setMaterial] = useState(null);


    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials/${materialId}`);
                const mat = res.data.material;
                setMaterial({
                    title: mat.title,
                    author: mat.author,
                    data: JSON.parse(mat.materialData),
                    materialAuthor: mat["user.username"]
                });
                setLoading(false);
            } catch(err) {
                if (err?.response?.status === 404) setNotFound(true);
                setIsError(true);
            }
        })();
    }, []);


    if (notFound) return <NotFoundPage/>;
    if (isError) return <ErrorPage/>;
    if (loading) return <LoadPage/>;

    const html = [];
    for (let section of material.data) {
        if (section.content.length === 0) continue;

        html.push(<HeadingSecondary3 key={section.heading} bottomMargin={4}>{section.heading}</HeadingSecondary3>);
        
        for (let [i, part] of section.content.entries()) {
            switch (part.type) {
                case "TEXT":
                case "TEXTAREA":
                    html.push(<HeadingTertiary2 key={`${part.name}-${part.i}`} bottomMargin={1}>{part.name}</HeadingTertiary2>);
                    html.push(<Paragraph key={`${i}-${part.name}`} bottomMargin={4}>{part.value}</Paragraph>);
                    break;
                case "CHARACTERS":
                    html.push(<HeadingTertiary2 key={`${part.name}-${part.i}`} bottomMargin={2}>{part.name}</HeadingTertiary2>);
                    for (let [j, character] of part.characters.entries()) {
                        html.push(<HeadingQuaternary key={`${i}-${j}-${part.name}`} bottomMargin={1}>{character.name}</HeadingQuaternary>);
                        html.push(<Paragraph key={`${part.name}-${i}-${j}`} bottomMargin={j === part.characters.length-1 ? 4 : 2}>{character.description}</Paragraph>);
                    }
                    break;
                case "PLOT":
                    html.push(<HeadingTertiary2 key={`${part.name}-${part.i}`} bottomMargin={1}>{part.name}</HeadingTertiary2>);
                    html.push(
                        <List key={`${i}-${part.name}`} items={part.plot.map(p => p.text)} bottomMargin={4}/>
                    )
                    break;
            }
        }
    }

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