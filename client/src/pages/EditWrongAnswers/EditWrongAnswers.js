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
import ErrorPage from '../ErrorPage/ErrorPage';
import LoadPage from '../LoadPage/LoadPage';

function EditWrongAnswers() {
    const { materialId } = useParams();

    const auth = useAuth();
    const navigate = useNavigate();

    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [questions, setQuestions] = useState(false);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const updateQuestions = () => {
        const newQuestions = [...questions];
        setQuestions(newQuestions);
    }

    const saveWrongAnswers = async () => {
        try {
            setSaveLoading(true);

            const wrongAnswers = [];
            for (let question of questions) {
                const wrongAnswer = {
                    name: question.name
                };
                const answers = [];
                for (let answer of question.wrongAnswers) {
                    if (answer.disabled || answer.value === "") continue;
                    answers.push(answer.value);
                }
                if (answers.length === 0) continue;
                wrongAnswer.answers = answers;
                wrongAnswers.push(wrongAnswer);
            }

            await axios.put(`${process.env.REACT_APP_API_URL}/materials/${materialId}/wrong-answers`, {
                wrongAnswers: JSON.stringify(wrongAnswers)
            }, auth.getHeaderConfig());
            navigate("/moje-materialy");
        } catch(err) {
            const errData = err.response.data;
            if (errData.error) setError(errData.error);

            setSaveLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials/${materialId}`, {
                    params: {
                        includeWrongAnswers: true
                    }
                });
                const material = res.data.material;

                const materialData = JSON.parse(material.materialData);
                const wrongAnswers = JSON.parse(material.wrongAnswers);
                const questionsArr = getQuestionsFromMaterial(materialData, wrongAnswers || []);

                setTitle(material.title);
                setAuthor(material.author);
                setQuestions(questionsArr);

                setLoading(false);
            } catch(err) {
                console.log(err);
                setIsError(true);
            }
        })();
    }, []);


    if (isError) return <ErrorPage/>;
    if (loading) return <LoadPage/>;

    const answersElements = [];
    for (let [i, question] of questions.entries()) {
        answersElements.push(<Answers key={i} updateQuestions={updateQuestions} question={question} bottomMargin={4}/>);
    }

    let html;
    if (answersElements.length > 0) {
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
        html = (
            <CenteredText>
                <Paragraph bottomMargin={4}>Pro tento materiál nejdou nastavit žádné špatné odpovědi. Budeš do něj muset přidat více informací.</Paragraph>
                <IllustrativeIcon iconName="icon-tongue" bottomMargin={6}/>
                <LinkButton to={`/editace-materialu/${materialId}`}>Editovat materiál</LinkButton>
            </CenteredText>
        );
    }

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