import './Test.scss';

import React from 'react';
import Button from '../../components/Button/Button';
import CenteredText from '../../components/CenteredText/CenteredText';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';
import HeadingTertiary2 from '../../components/HeadingTertiary2/HeadingTertiary2';
import config from '../../config';
import Paragraph from '../../components/Paragraph/Paragraph';
import StrikeThroughText from '../../components/StrikeThroughText/StrikeThroughText';
import List from '../../components/List/List';
import { useNavigate } from 'react-router-dom';

function TestResultsPart(props) {
    const navigate = useNavigate();

    let numberOfQuestions = 0;
    let numberofMistakes = 0;

    const questions = props.quizData.filter(question => question.checked).map((question, idx) => {
        numberOfQuestions++;

        if (question.type === "QUESTION") {
            const isCorrect = question.selectedAnswerIdx === question.rightAnswerIdx;
            if (!isCorrect) numberofMistakes++;
            return (
                <div key={idx} style={{ marginBottom: "1.6rem" }}>
                    <HeadingTertiary2 bottomMargin={2}>{question.title}</HeadingTertiary2>
                    {
                        isCorrect
                        ? (
                            <>
                                <h4 className='Test__answer-heading'>
                                    <svg>
                                        <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-checkmark`}></use>
                                    </svg>
                                    <span>Správně</span>
                                </h4>
                                <Paragraph>{question.answers[question.rightAnswerIdx]}</Paragraph>
                            </>
                        )
                        : (
                            <>
                                <h4 className='Test__answer-heading Test__answer-heading--bad'>
                                    <svg>
                                        <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-cross`}></use>
                                    </svg>
                                    <span>Špatně{question.selectedAnswerIdx === undefined && " (nevyplněno)"}</span>
                                </h4>
                                {
                                    question.selectedAnswerIdx !== undefined &&
                                    <StrikeThroughText>
                                        <Paragraph bottomMargin={2}>{question.answers[question.selectedAnswerIdx]}</Paragraph>
                                    </StrikeThroughText>
                                }
                                <Paragraph>{question.answers[question.rightAnswerIdx]}</Paragraph>
                            </>
                        )
                    }
                </div>
            );
        }

        if (question.type === "CHARACTERS") {
            let wrong = false;
            const characterQuestions = question.characterDescriptions.map((characterDescription, idx) => {

                const isMistake = characterDescription.selectedNameIdx !== characterDescription.rightNameIdx;
                if (isMistake) wrong = true;

                return (
                    <React.Fragment key={idx}>
                        <Paragraph bottomMargin={2}>{characterDescription.description}</Paragraph>
                        {
                            isMistake &&
                            <StrikeThroughText>
                                <p className='Test__character-name' style={{ marginBottom: ".4rem" }}>{question.characterNames[characterDescription.selectedNameIdx]}</p>
                            </StrikeThroughText>
                        }
                        <p className='Test__character-name' style={{ marginBottom: idx !== question.characterDescriptions.length-1 ? ".8rem" : "0" }}>{question.characterNames[characterDescription.rightNameIdx]}</p>
                        {
                            idx !== question.characterDescriptions.length-1 &&
                            <HorizontalRule bottomMargin={2}/>
                        }
                    </React.Fragment>
                )
            });
            if (wrong) numberofMistakes++;

            return (
                <div key={idx} style={{ marginBottom: "1.6rem" }}>
                    <HeadingTertiary2 bottomMargin={2}>Postavy</HeadingTertiary2>
                    {
                        wrong
                        ? (
                            <h4 className='Test__answer-heading Test__answer-heading--bad'>
                                <svg>
                                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-cross`}></use>
                                </svg>
                                <span>Špatně</span>
                            </h4>
                        )
                        : (
                            <h4 className='Test__answer-heading'>
                                <svg>
                                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-checkmark`}></use>
                                </svg>
                                <span>Správně</span>
                            </h4>
                        )
                    }
                    {characterQuestions}
                </div>
            )
        }

        if (question.type === "PLOT") {
            let wrong = false;
            for (let i = 0; i < question.plot.length; i++) {
                if (question.plot[i].position !== i) {
                    wrong = true;
                    break;
                }
            }

            if (wrong) numberofMistakes++;

            let plot;
            if (wrong) {
                plot = [...question.plot].sort((a, b) => {
                    if (a.position < b.position) return -1;
                    return 1;
                });
            } else {
                plot = question.plot;
            }

            return (
                <div key={idx} style={{ marginBottom: "1.6rem" }}>
                    <HeadingTertiary2 bottomMargin={2}>Seskládej děj</HeadingTertiary2>
                    {
                        wrong
                        ? (
                            <>
                                <h4 className='Test__answer-heading Test__answer-heading--bad'>
                                    <svg>
                                        <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-cross`}></use>
                                    </svg>
                                    <span>Špatně</span>
                                </h4>
                                <p className='Test__right-plot' style={{ marginBottom: ".4rem" }}>Správný děj</p>
                            </>
                        )
                        : (
                            <h4 className='Test__answer-heading'>
                                <svg>
                                    <use xlinkHref={`${config.ICON_SPRITE_PATH}#icon-checkmark`}></use>
                                </svg>
                                <span>Správně</span>
                            </h4>
                        )
                    }
                    <List items={plot.map(part => part.text)}/>
                </div>
            )
        }
    });

    return (
        <>
            {questions}
            <VerticalSpace size={6}/>
            <HorizontalRule bottomMargin={4}/>
            <CenteredText>
                <p className='Test__result-text'>Správné odpovědi: {numberOfQuestions-numberofMistakes}/{numberOfQuestions}</p>
                <Button onClick={() => navigate(-1)}>Pokračovat</Button>
            </CenteredText>
        </>
    );
}

export default TestResultsPart;