import './Survey.scss';

import React, { useEffect, useState } from 'react';
import HeadingSecondary from '../HeadingSecondary/HeadingSecondary';
import CenteredText from '../CenteredText/CenteredText';
import Paragraph from '../Paragraph/Paragraph';
import VerticalSpace from '../VerticalSpace/VerticalSpace';
import SurveyBox from '../SurveyBox/SurveyBox';
import ButtonSelectInput from '../ButtonSelectInput/ButtonSelectInput';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import LoadIcon from '../LoadIcon/LoadIcon';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function Survey() {
    const auth = useAuth();

    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [changeVoteLoading, setChangeVoteLoading] = useState(false);

    const [selectedVoteOption, setSelectedVoteOption] = useState(0);
    const [votes, setVotes] = useState(null);

    const loadVotes = async () => {
        try {
            const votesReq = axios.get(`${process.env.REACT_APP_API_URL}/votes`);

            if (auth.currentUser) {
                const voteReq = axios.get(`${process.env.REACT_APP_API_URL}/users/${auth.currentUser.id}/vote`, auth.getHeaderConfig());
                const [votesRes, voteRes] = await Promise.all([votesReq, voteReq]);
                setVotes(votesRes.data.votes);
    
                if (voteRes.data.vote === null) setSelectedVoteOption(1);
                else if (voteRes.data.vote.agree) setSelectedVoteOption(2);
                else setSelectedVoteOption(0);
            } else {
                const votesRes = await votesReq;
                setVotes(votesRes.data.votes);
            }

            setLoading(false);
        } catch(err) {
            setIsError(true);
        }
    }

    const handleVote = async (option) => {
        setSelectedVoteOption(option);
        setChangeVoteLoading(true);

        const newVotes = {...votes};
        switch (selectedVoteOption) {
            case 0:
                newVotes.disagree--;
                break;
            case 2:
                newVotes.agree--;
                break;
        }

        try {
            switch (option) {
                case 0: // patří
                    await axios.post(`${process.env.REACT_APP_API_URL}/users/${auth.currentUser.id}/vote?agree=false`, {}, auth.getHeaderConfig());
                    newVotes.disagree++;
                    break;
                case 1: // neúčastním se
                    await axios.delete(`${process.env.REACT_APP_API_URL}/users/${auth.currentUser.id}/vote`, auth.getHeaderConfig());
                    break;
                case 2: // nepatří
                    await axios.post(`${process.env.REACT_APP_API_URL}/users/${auth.currentUser.id}/vote?agree=true`, {}, auth.getHeaderConfig());
                    newVotes.agree++;
                    break;
            }
        } catch(err) {
            setIsError(true);
        }

        setVotes(newVotes);
        setChangeVoteLoading(false);
    }

    useEffect(() => {
        loadVotes();
    }, []);

    
    if (isError) return <ErrorMessage>Anketu se bohužel nepodařilo načíst.</ErrorMessage>;
    if (loading) return <LoadIcon/>;

    return (
        <CenteredText>
            <SurveyBox votes={votes.agree} bigText={votes.agree > votes.disagree}>si myslí, že literatura na maturitu nepatří</SurveyBox>
            <VerticalSpace size={4}/>
            <SurveyBox votes={votes.disagree} bigText={votes.agree < votes.disagree} orange>si myslí, že literatura na maturitu patří</SurveyBox>
            {
                auth.currentUser &&
                <>
                    <VerticalSpace size={6}/>
                    <HeadingSecondary asH3 bottomMargin={2}>Tvůj hlas</HeadingSecondary>
                    <Paragraph bottomMargin={4}>Z následujících možností můžeš vybrat, jestli si myslíš že literatura na maturitu patří nebo ne a zapojit se tak do ankety.</Paragraph>
                    {
                        changeVoteLoading
                        ? <LoadIcon small/>
                        : <ButtonSelectInput selectedOptionIdx={selectedVoteOption} onChange={handleVote} options={["patří", "neúčastním se", "nepatří"]}/>
                    }
                </>
            }
        </CenteredText>
    );
}

export default Survey;