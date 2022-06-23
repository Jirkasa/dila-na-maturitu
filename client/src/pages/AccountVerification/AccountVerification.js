import axios from 'axios';
import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import CenteredText from '../../components/CenteredText/CenteredText';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import IllustrativeIcon from '../../components/IllustrativeIcon/IllustrativeIcon';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import Paragraph from '../../components/Paragraph/Paragraph';
import { useAuth } from '../../contexts/AuthContext';
import ErrorPage from '../ErrorPage/ErrorPage';

function AccountVerification() {
    const auth = useAuth();

    const [newTokenSent, setNewTokenSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const sendNewVerificationToken = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/users/resend-verification-token`, {}, auth.getHeaderConfig());
            setNewTokenSent(true);
            setLoading(false);
        } catch(err) {
            if (err.response.status === 409) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${auth.currentUser.id}`, auth.getHeaderConfig());
                    auth.updateCurrentUser(res.data.user);
                } catch(err) {
                    setIsError(true);
                }
                return;
            }
            setIsError(true);
            setLoading(false);
        }
    }

    if (isError) return <ErrorPage/>;

    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Ověření účtu</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    <Paragraph bottomMargin={4}>Předtím než budeš pokračovat, je potřeba ověřit tvůj účet. Na email ti byl zaslán odkaz pro ověření.</Paragraph>
                    <IllustrativeIcon iconName="icon-mail2" bottomMargin={6}/>
                    {
                        loading
                        ? <LoadIcon small/>
                        : !newTokenSent && <Button onClick={sendNewVerificationToken}>Odeslat nový odkaz pro ověření</Button>
                    }
                </CenteredText>
            </PageLayoutCentered>
        </Page>
    );
}

export default AccountVerification;