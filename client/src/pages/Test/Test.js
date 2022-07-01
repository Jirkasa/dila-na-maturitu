import axios from 'axios';
import { shuffle } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CenteredText from '../../components/CenteredText/CenteredText';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HeadingSecondary2 from '../../components/HeadingSecondary2/HeadingSecondary2';
import HeadingSecondary3 from '../../components/HeadingSecondary3/HeadingSecondary3';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import Page from '../../components/Page/Page';
import PageLayoutLeft from '../../components/PageLayoutLeft/PageLayoutLeft';
import ErrorPage from '../ErrorPage/ErrorPage';
import LoadPage from '../LoadPage/LoadPage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import TestQuizPart from './TestQuizPart';
import TestResultsPart from './TestResultsPart';
import TestSelectQuestionsPart from './TestSelectQuestionsPart';

function Test() {
    const { materialId } = useParams();

    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [quizData, setQuizData] = useState([]);
    const [quizState, setQuizState] = useState("PREPARATION") // PREPARATION | TEST | RESULTS

    const updateQuizData = () => setQuizData([...quizData]);
    
    const startQuiz = () => setQuizState("TEST");
    const endQuiz = () => setQuizState("RESULTS");

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials/${materialId}`, {
                    params: {
                        includeWrongAnswers: true
                    }
                });
                const mat = res.data.material;

                setTitle(mat.title);
                setAuthor(mat.author);

                const materialData = JSON.parse(mat.materialData);
                const wrongAnswersArr = JSON.parse(mat.wrongAnswers);
                const wrongAnswers = {};
                if (wrongAnswersArr) {
                    for (let wrongAnswer of wrongAnswersArr) {
                        wrongAnswers[wrongAnswer.name] = wrongAnswer.answers;
                    }
                }

                const data = [];
                for (let section of materialData) {
                    for (let part of section.content) {
                        let question;
                        switch (part.type) {
                            case "TEXT":
                            case "TEXTAREA":
                                if (!wrongAnswers[part.name]) break;
                                question = {
                                    type: "QUESTION",
                                    title: part.name,
                                }

                                const answers = shuffle(wrongAnswers[part.name]);
                                const rightAnswerIndex = Math.floor(Math.random() * (answers.length+1));
                                answers.splice(rightAnswerIndex, 0, part.value);

                                question.answers = answers;
                                question.rightAnswerIdx = rightAnswerIndex;
                                break;
                            case "CHARACTERS":
                                if (part.characters < 2) break;
                                question = {
                                    type: "CHARACTERS",
                                    title: part.name,
                                    characterNames: part.characters.map(character => character.name)
                                }

                                const characters = part.characters.map((character, index) => {
                                    return {
                                        description: character.description,
                                        rightNameIdx: index,
                                        selectedNameIdx: 0
                                    };
                                });
                                question.characterDescriptions = shuffle(characters);
                                break;
                            case "PLOT":
                                if (part.plot < 2) break;
                                question = {
                                    type: "PLOT",
                                    title: part.name
                                }

                                const plot = part.plot.map((plotPart, idx) => {
                                    return {
                                        text: plotPart.text,
                                        position: idx
                                    }
                                });
                                question.plot = shuffle(plot);
                                break;
                        }
                        if (question) {
                            question.checked = true;
                            data.push(question);
                        }
                    }
                }

                if (data.length === 0) return setNotFound(true);

                setQuizData(data);
                setLoading(false);
            } catch(err) {
                console.log(err);
                if (err?.response?.status === 404) setNotFound(true);
                setIsError(true);
            }
        })();
    }, []);


    if (notFound) return <NotFoundPage/>;
    if (isError) return <ErrorPage/>;
    if (loading) return <LoadPage/>;

    let quizPage;
    switch (quizState) {
        case "PREPARATION":
            quizPage = <TestSelectQuestionsPart quizData={quizData} updateQuizData={updateQuizData} startQuiz={startQuiz}/>;
            break;
        case "TEST":
            quizPage = <TestQuizPart quizData={quizData} updateQuizData={updateQuizData} endQuiz={endQuiz}/>;
            break;
        case "RESULTS":
            quizPage = <TestResultsPart quizData={quizData}/>;
            break;
    }

    return (
        <Page flex>
            <PageLayoutLeft>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Test</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    <HeadingSecondary3 bottomMargin={2}>{title}</HeadingSecondary3>
                    <HeadingSecondary2 bottomMargin={4} asH3>{author}</HeadingSecondary2>
                    <HorizontalRule bottomMargin={4}/>
                </CenteredText>
                {quizPage}
            </PageLayoutLeft>
        </Page>
    );
}

export default Test;