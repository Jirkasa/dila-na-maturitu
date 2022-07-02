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

// SURVEY
// - displayed on Home Page
function Survey() {
    const auth = useAuth();

    // determines whether survey is being loaded
    const [loading, setLoading] = useState(true);
    // determines whether user vote is being changed
    const [changeVoteLoading, setChangeVoteLoading] = useState(false);

    // determines whether Error Page should be displayed
    const [isError, setIsError] = useState(false);

    // stores selected vote option
    // 0 - patří
    // 1 - neúčastním se
    // 2 - nepatří
    const [selectedVoteOption, setSelectedVoteOption] = useState(0);
    // stores survery votes
    const [votes, setVotes] = useState(null);

    // FUNCTION to load votes
    const loadVotes = async () => {
        try {
            // send request to get votes
            const votesReq = axios.get(`${process.env.REACT_APP_API_URL}/votes`);

            if (auth.currentUser) {
                // if user is logged in, request to get his vote is sent
                const voteReq = axios.get(`${process.env.REACT_APP_API_URL}/users/${auth.currentUser.id}/vote`, auth.getHeaderConfig());
                // get responses
                const [votesRes, voteRes] = await Promise.all([votesReq, voteReq]);

                // store votes
                setVotes(votesRes.data.votes);
    
                // store vote state based on value of user vote
                if (voteRes.data.vote === null) setSelectedVoteOption(1); // neúčastním se
                else if (voteRes.data.vote.agree) setSelectedVoteOption(2); // nepatří
                else setSelectedVoteOption(0); // patří
            } else {
                // if user is not logged in, wait for response from votes request
                const votesRes = await votesReq;
                // store votes from response
                setVotes(votesRes.data.votes);
            }

            // votes are loaded
            setLoading(false);
        } catch(err) {
            // if an error occured, Error Page is displayed
            setIsError(true);
        }
    }

    // FUNCTION to vote
    const handleVote = async (option) => {
        // get votes to perform update
        const newVotes = {...votes};
        // 
        switch (selectedVoteOption) {
            case 0:
                newVotes.disagree--;
                break;
            case 2:
                newVotes.agree--;
                break;
        }

        // change selected vote option
        setSelectedVoteOption(option);
        // vote is being changed
        setChangeVoteLoading(true);

        try {
            // send request based on selected option
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
            // if an error occured, error message is displayed
            setIsError(true);
        }

        // update votes state
        setVotes(newVotes);
        // vote has been changed
        setChangeVoteLoading(false);
    }

    // called when Survey is rendered for the first time
    useEffect(() => {
        loadVotes();
    }, []);

    
    // if an error occured, error message is displayed
    if (isError) return <ErrorMessage>Anketu se bohužel nepodařilo načíst.</ErrorMessage>;
    // if survey is being loaded, load icon is displayed
    if (loading) return <LoadIcon/>;

    // render survey
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