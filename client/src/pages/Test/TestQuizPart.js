import React from 'react';
import Button from '../../components/Button/Button';
import CenteredText from '../../components/CenteredText/CenteredText';
import ComposePlotInput from '../../components/ComposePlotInput/ComposePlotInput';
import HeadingQuaternary from '../../components/HeadingQuaternary/HeadingQuaternary';
import HeadingTertiary2 from '../../components/HeadingTertiary2/HeadingTertiary2';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import Paragraph from '../../components/Paragraph/Paragraph';
import RadioInput from '../../components/RadioInput/RadioInput';
import SelectInput from '../../components/SelectInput/SelectInput';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';

function TestQuizPart(props) {

    const questions = props.quizData.filter(question => question.checked).map((question, idx) => {
        if (question.type === "QUESTION") {
            return (
                <div key={idx} style={{ marginBottom: "1.6rem" }}>
                    <HeadingTertiary2 bottomMargin={2}>{question.title}</HeadingTertiary2>
                    <RadioInput
                        onChange={(e) => {
                            question.selectedAnswerIdx = +e.target.value;
                            props.updateQuizData();
                        }}
                        idPrefix={question.title}
                        options={question.answers}
                    />
                </div>
            );
        }
        if (question.type === "CHARACTERS") {
            const characterQuestions = question.characterDescriptions.map((characterDescription, idx) => {
                return (
                    <div key={idx} style={{ marginBottom: "1.2rem" }}>
                        <HeadingQuaternary bottomMargin={2}>O jakou postavu se jedná</HeadingQuaternary>
                        <Paragraph bottomMargin={2}>{characterDescription.description}</Paragraph>
                        <SelectInput
                            onChange={(e) => {
                                characterDescription.selectedNameIdx = +e.target.value;
                                props.updateQuizData();
                            }}
                            options={question.characterNames}
                        />
                    </div>
                );
            });

            return (
                <div key={idx} style={{ marginBottom: "1.6rem" }}>
                    <HeadingTertiary2 bottomMargin={2}>{question.title}</HeadingTertiary2>
                    {characterQuestions}
                </div>
            );
        }
        if (question.type === "PLOT") {
            return (
                <div key={idx} style={{ marginBottom: "1.6rem" }}>
                    <HeadingTertiary2 bottomMargin={2}>Seskládej děj</HeadingTertiary2>
                    <ComposePlotInput plot={question.plot} updateQuizData={props.updateQuizData}/>
                </div>
            );
        }
    });

    return (
        <>
            {questions}
            <VerticalSpace size={6}/>
            <HorizontalRule bottomMargin={6}/>
            <CenteredText>
                <Button onClick={props.endQuiz}>Vyhodnotit</Button>
            </CenteredText>
        </>
    );
}

export default TestQuizPart;