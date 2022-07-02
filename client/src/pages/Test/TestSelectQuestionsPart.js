import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import CenteredText from '../../components/CenteredText/CenteredText';
import CheckableOption2 from '../../components/CheckableOption2/CheckableOption2';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';

// PREPARATION PART OF PAGE FOR TEST PAGE
function TestSelectQuestionsPart(props) {
    // determines whether no question was selected
    const [nothingSelected, setNothingSelected] = useState(false);

    // FUNCTION to start quiz
    const handleStart = () => {
        // check whether at least one question was selected
        let noQuestion = true;
        for (let question of props.quizData) {
            if (question.checked) {
                noQuestion = false;
                break;
            }
        }
        // if no question was selected, error message is displayed
        if (noQuestion) return setNothingSelected(true);
        // otherwise, quiz is started
        props.startQuiz();
    }

    // create question options to be rendered on the page
    const questionOptions = props.quizData.map((question, idx) => {
        return <CheckableOption2
            checked={question.checked}
            onChange={e => {
                // when option is checked/unchecked, question is updated
                question.checked = e.target.checked
                // quiz data (state) are updated
                props.updateQuizData();
            }}
            bottomMargin={2}
            key={idx}
        >{question.title}</CheckableOption2>;
    });

    // render page
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