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

// QUIZ PART OF PAGE FOR TEST PAGE
function TestQuizPart(props) {

    // get array of question elements to be displayed on page
    const questions = props.quizData.filter(question => question.checked).map((question, idx) => {
        // if question is of type QUESTION
        if (question.type === "QUESTION") {
            // question title and radio input is displayed
            return (
                <div key={idx} style={{ marginBottom: "1.6rem" }}>
                    <HeadingTertiary2 bottomMargin={2}>{question.title}</HeadingTertiary2>
                    <RadioInput
                        onChange={(e) => {
                            // when user changes his answer, selected answer index of question is updated
                            question.selectedAnswerIdx = +e.target.value;
                            // update quiz data (state)
                            props.updateQuizData();
                        }}
                        idPrefix={question.title}
                        options={question.answers}
                    />
                </div>
            );
        }
        // if question is of type CHARACTERS
        if (question.type === "CHARACTERS") {
            // character questions are displayed
            const characterQuestions = question.characterDescriptions.map((characterDescription, idx) => {
                // for each character question is displayed question heading, character description and select input 
                return (
                    <div key={idx} style={{ marginBottom: "1.2rem" }}>
                        <HeadingQuaternary bottomMargin={2}>O jakou postavu se jedná</HeadingQuaternary>
                        <Paragraph bottomMargin={2}>{characterDescription.description}</Paragraph>
                        <SelectInput
                            onChange={(e) => {
                                // when user changes his answers, selected name index of character description is updated
                                characterDescription.selectedNameIdx = +e.target.value;
                                // update quiz data (state)
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
        // if question is of type PLOT
        if (question.type === "PLOT") {
            // question title and input to compose plot is displayed
            return (
                <div key={idx} style={{ marginBottom: "1.6rem" }}>
                    <HeadingTertiary2 bottomMargin={2}>Seskládej děj</HeadingTertiary2>
                    <ComposePlotInput plot={question.plot} updateQuizData={props.updateQuizData}/>
                </div>
            );
        }
    });

    // render question elements to page
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