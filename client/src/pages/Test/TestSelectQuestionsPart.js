import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import CenteredText from '../../components/CenteredText/CenteredText';
import CheckableOption2 from '../../components/CheckableOption2/CheckableOption2';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';

function TestSelectQuestionsPart(props) {
    const [nothingSelected, setNothingSelected] = useState(false);

    const handleStart = () => {
        let noQuestion = true;
        for (let question of props.quizData) {
            if (question.checked) {
                noQuestion = false;
                break;
            }
        }
        if (noQuestion) return setNothingSelected(true);
        props.startQuiz();
    }

    const questionOptions = props.quizData.map((question, idx) => {
        return <CheckableOption2
            checked={question.checked}
            onChange={e => {
                question.checked = e.target.checked
                props.updateQuizData();
            }}
            bottomMargin={2}
            key={idx}
        >{question.title}</CheckableOption2>;
    });

    return (
        <>
            {questionOptions}
            <VerticalSpace size={4}/>
            <HorizontalRule bottomMargin={4}/>
            {nothingSelected && <ErrorMessage>Nebyla vybrána žádná část.</ErrorMessage>}
            <CenteredText>
                <Button onClick={handleStart}>Spustit test</Button>
            </CenteredText>
        </>
    );
}

export default TestSelectQuestionsPart;