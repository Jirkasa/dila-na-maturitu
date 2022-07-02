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

// TEST PAGE
function Test() {
    // get material ID from params
    const { materialId } = useParams();

    // determines whether material is being loaded
    const [loading, setLoading] = useState(true);

    // determines whether Error Page should be displayed
    const [isError, setIsError] = useState(false);
    // determines whether Not Found Page should be displayed
    const [notFound, setNotFound] = useState(false);

    // here is stored title and author to be displayed at the top of the page
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    // here are stored quiz data (created from material data and wrong answers)
    const [quizData, setQuizData] = useState([]);
    // determines state (page) of quiz
    const [quizState, setQuizState] = useState("PREPARATION") // PREPARATION | TEST | RESULTS

    // FUNCTION to update quiz data (state)
    const updateQuizData = () => setQuizData([...quizData]);
    
    // FUNCTION to start quiz
    const startQuiz = () => setQuizState("TEST");
    // FUNCTION to end quiz
    const endQuiz = () => setQuizState("RESULTS");

    // called when page is loaded for the first page
    useEffect(() => {
        (async () => {
            try {
                // send request to get material with wrong answers
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials/${materialId}`, {
                    params: {
                        includeWrongAnswers: true
                    }
                });
                // get material from response
                const mat = res.data.material;

                // store title and author
                setTitle(mat.title);
                setAuthor(mat.author);

                // parse material data and wrong answers
                const materialData = JSON.parse(mat.materialData);
                const wrongAnswersArr = JSON.parse(mat.wrongAnswers);

                // create map of wrong answers
                // - key = question name
                // - value = array of wrong answers
                const wrongAnswers = {};
                if (wrongAnswersArr) {
                    for (let wrongAnswer of wrongAnswersArr) {
                        wrongAnswers[wrongAnswer.name] = wrongAnswer.answers;
                    }
                }

                // create quiz data
                const data = [];
                // - for each section of material data
                for (let section of materialData) {
                    // - for each part of section
                    for (let part of section.content) {
                        // create question object
                        let question;
                        // - create question based on type of section part
                        switch (part.type) {
                            case "TEXT":
                            case "TEXTAREA":
                                // if there are no wrong answers for this part, question is not created
                                if (!wrongAnswers[part.name]) break;

                                // create question
                                question = {
                                    type: "QUESTION",
                                    title: part.name,
                                }

                                // get shuffled array of wrong answers for this part
                                const answers = shuffle(wrongAnswers[part.name]);
                                // add right answer somewhere into array
                                const rightAnswerIndex = Math.floor(Math.random() * (answers.length+1));
                                answers.splice(rightAnswerIndex, 0, part.value);

                                // add array of answers to question object
                                question.answers = answers;
                                // store index to right answer in answers array in object
                                question.rightAnswerIdx = rightAnswerIndex;
                                break;
                            case "CHARACTERS":
                                // if there is just one character in this part, question is not created
                                if (part.characters < 2) break;

                                // create question
                                question = {
                                    type: "CHARACTERS",
                                    title: part.name,
                                    characterNames: part.characters.map(character => character.name) // store character names
                                }

                                // create array of character descriptions
                                const characters = part.characters.map((character, index) => {
                                    return {
                                        description: character.description, // character description
                                        rightNameIdx: index, // index to the right name in characterNames array property
                                        selectedNameIdx: 0 // index of currently selected name in characterNames array property
                                    };
                                });
                                // add array of character descriptions to question object
                                question.characterDescriptions = shuffle(characters);
                                break;
                            case "PLOT":
                                // if there is just one part of plot, question is not created
                                if (part.plot < 2) break;

                                // create question
                                question = {
                                    type: "PLOT",
                                    title: part.name
                                }

                                // get array of plot parts with their position
                                const plot = part.plot.map((plotPart, idx) => {
                                    return {
                                        text: plotPart.text, // plot part text
                                        position: idx // plot part position in plot
                                    }
                                });
                                // shuffle array of plot parts and store it in question object
                                question.plot = shuffle(plot);
                                break;
                        }
                        // if question was created, set it as checked and add to quiz data
                        if (question) {
                            question.checked = true;
                            data.push(question);
                        }
                    }
                }

                // if there are no questions for this material, Not Found Page is displayed
                if (data.length === 0) return setNotFound(true);

                // store quiz data
                setQuizData(data);
                // material (quiz) has been succesfully loaded
                setLoading(false);
            } catch(err) {
                // if material wasn't found, Not Found Page is displayed
                if (err?.response?.status === 404) setNotFound(true);
                // if any other error occured, Error Page is displayed
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

    // determine what part of quiz page to render based on state of quiz
    let quizPage;
    switch (quizState) {
        case "PREPARATION":
            // preparation page
            quizPage = <TestSelectQuestionsPart quizData={quizData} updateQuizData={updateQuizData} startQuiz={startQuiz}/>;
            break;
        case "TEST":
            // test page
            quizPage = <TestQuizPart quizData={quizData} updateQuizData={updateQuizData} endQuiz={endQuiz}/>;
            break;
        case "RESULTS":
            // results page
            quizPage = <TestResultsPart quizData={quizData}/>;
            break;
    }

    // render Test page
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