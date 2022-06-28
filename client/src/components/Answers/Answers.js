import React from 'react';
import HeadingTertiary2 from '../HeadingTertiary2/HeadingTertiary2';
import HeadingQuaternary2 from '../HeadingQuaternary2/HeadingQuaternary2';
import Paragraph from '../Paragraph/Paragraph';
import CheckableInput from '../CheckableInput/CheckableInput';

function Answers(props) {
    const bottomMargin = props.bottomMargin ? props.bottomMargin * 0.4 : 0;

    const changeWrongAnswer = (index, value, disabled) => {
        props.question.wrongAnswers[index].value = value;
        props.question.wrongAnswers[index].disabled = disabled;
        props.updateQuestions();
    }

    return (
        <div style={{ marginBottom: `${bottomMargin}rem` }}>
            <HeadingTertiary2 bottomMargin={2}>{props.question.name}</HeadingTertiary2>
            <HeadingQuaternary2 bottomMargin={1} green>Správná odpověď</HeadingQuaternary2>
            <Paragraph bottomMargin={2}>{props.question.rightAnswer}</Paragraph>
            <HeadingQuaternary2 bottomMargin={2}>Špatné odpovědi</HeadingQuaternary2>
            <CheckableInput
                onChange={(input) => changeWrongAnswer(0, input.value, !input.checked)}
                checked={!props.question.wrongAnswers[0].disabled}
                value={props.question.wrongAnswers[0].value}
                bottomMargin={2}
            />
            <CheckableInput
                onChange={(input) => changeWrongAnswer(1, input.value, !input.checked)}
                checked={!props.question.wrongAnswers[1].disabled}
                value={props.question.wrongAnswers[1].value}
                bottomMargin={2}
            />
            <CheckableInput
                onChange={(input) => changeWrongAnswer(2, input.value, !input.checked)}
                checked={!props.question.wrongAnswers[2].disabled}
                value={props.question.wrongAnswers[2].value}
            />
        </div>
    );
}

export default Answers;