import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Answers from '../../components/Answers/Answers';
import Button from '../../components/Button/Button';
import LinkButton from '../../components/Button/LinkButton';
import CenteredText from '../../components/CenteredText/CenteredText';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HeadingSecondary2 from '../../components/HeadingSecondary2/HeadingSecondary2';
import HeadingSecondary3 from '../../components/HeadingSecondary3/HeadingSecondary3';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import IllustrativeIcon from '../../components/IllustrativeIcon/IllustrativeIcon';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import Page from '../../components/Page/Page';
import PageLayoutLeft from '../../components/PageLayoutLeft/PageLayoutLeft';
import Paragraph from '../../components/Paragraph/Paragraph';
import { useAuth } from '../../contexts/AuthContext';
import { getQuestionsFromMaterial } from '../../helpers';
import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import LoadPage from '../LoadPage/LoadPage';

// EDIT WRONG ANSWERS PAGE
function EditWrongAnswers() {
    // get material ID from params
    const { materialId } = useParams();

    const auth = useAuth();
    const navigate = useNavigate();

    // determines whether an Error Page should be displayed
    const [isError, setIsError] = useState(false);
    // determines whether Access Denied page should be displayed
    const [accessDenied, setAccessDenied] = useState(false);
    // stores error messsage if an error occurs
    const [error, setError] = useState(null);

    // determines whether material is being loaded from server
    const [loading, setLoading] = useState(true);
    // determines whether wrong answers are being saved to server
    const [saveLoading, setSaveLoading] = useState(false);

    // here are stored questions after material is loaded
    const [questions, setQuestions] = useState(false);
    // here is stored title and author to be displayed as heading of page
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    // FUNCTION to update questions (state) after change of questions
    const updateQuestions = () => {
        const newQuestions = [...questions];
        setQuestions(newQuestions);
    }

    // FUNCTION to save wrong answers to server
    const saveWrongAnswers = async () => {
        try {
            // wrong answers are being saved to server
            setSaveLoading(true);

            // create array of wrong answers to be sent to server
            const wrongAnswers = [];
            // - for each question of questions array
            for (let question of questions) {
                // create wrong answer object
                const wrongAnswer = {
                    name: question.name
                };
                // create answers array
                const answers = [];
                // - add wrong answers that are not disabled to answers array
                for (let answer of question.wrongAnswers) {
                    if (answer.disabled || answer.value === "") continue;
                    answers.push(answer.value);
                }
                // if there are no wrong answers for this question, they are not sent to server
                if (answers.length === 0) continue;
                // add answers array to wrong answer object
                wrongAnswer.answers = answers;
                // add wrong answer object to array of wrong answers
                wrongAnswers.push(wrongAnswer);
            }

            // save wrong answers to server
            await axios.put(`${process.env.REACT_APP_API_URL}/materials/${materialId}/wrong-answers`, {
                wrongAnswers: JSON.stringify(wrongAnswers)
            }, auth.getHeaderConfig());
            // redirect user to My Materials page
            navigate("/moje-materialy");
        } catch(err) {
            // if error occurs, error message is set
            const errData = err.response.data;
            if (errData.error) setError(errData.error);

            // wrong answers are no longer being sent to server
            setSaveLoading(false);
        }
    }

    // called when page is rendered for the first time
    useEffect(() => {
        (async () => {
            try {
                // send request to get material with wrong answers from server
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials/${materialId}`, {
                    params: {
                        includeWrongAnswers: true
                    }
                });
                // get material from response
                const material = res.data.material;

                // if user is not owner of this material, Access Denied page is displayed
                if (material["user.id"] !== auth.currentUser.id) return setAccessDenied(true);

                // Parse material data and wrong answers from material object
                const materialData = JSON.parse(material.materialData);
                const wrongAnswers = JSON.parse(material.wrongAnswers);
                
                // get questions array to be used for wrong answers editing
                const questionsArr = getQuestionsFromMaterial(materialData, wrongAnswers || []);

                // store title and author to be displayed as heading of page
                setTitle(material.title);
                setAuthor(material.author);
                // store questions array
                setQuestions(questionsArr);

                // material with wrong answers has been loaded
                setLoading(false);
            } catch(err) {
                // if an error occured, Error Page is displayed
                setIsError(true);
            }
        })();
    }, []);


    // if an error occured, Error Page is displayed
    if (isError) return <ErrorPage/>;
    // if user does not have right to edit wrong answers for this material, Access Denied Page is rendered
    if (accessDenied) return <AccessDeniedPage/>;
    // if material is being loaded from server, Load Page is rendered
    if (loading) return <LoadPage/>;

    // create array with answers elements (each element is heading with right answer and 3 checkable options)
    const answersElements = [];
    // - for each question in questions array
    for (let [i, question] of questions.entries()) {
        // add answers options for this question to answers elements array
        answersElements.push(<Answers key={i} updateQuestions={updateQuestions} question={question} bottomMargin={4}/>);
    }

    // determine what should be render (answers element or text that for this material can't be created any wrong answers)
    let html;
    // if there can be wrong answers created for this material
    if (answersElements.length > 0) {
        // answers elements with save button will be render to page
        html = (
            <>
                {answersElements}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <CenteredText>
                    {
                        saveLoading
                        ? <LoadIcon small/>
                        : <Button onClick={saveWrongAnswers}>Uložit špatné odpovědi</Button>
                    }
                </CenteredText>
            </>
        );
    } else {
        // if there can't be wrong answers created for this material, user is informed about that
        html = (
            <CenteredText>
                <Paragraph bottomMargin={4}>Pro tento materiál nejdou nastavit žádné špatné odpovědi. Budeš do něj muset přidat více informací.</Paragraph>
                <IllustrativeIcon iconName="icon-tongue" bottomMargin={6}/>
                <LinkButton to={`/editace-materialu/${materialId}`}>Editovat materiál</LinkButton>
            </CenteredText>
        );
    }

    // render Edit Wrong Answers page
    return (
        <Page flex>
            <PageLayoutLeft>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Editace špatných odpovědí</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    <HeadingSecondary3 bottomMargin={2}>{title}</HeadingSecondary3>
                    <HeadingSecondary2 bottomMargin={8} asH3>{author}</HeadingSecondary2>
                </CenteredText>
                {html}
            </PageLayoutLeft>
        </Page>
    );
}

export default EditWrongAnswers;