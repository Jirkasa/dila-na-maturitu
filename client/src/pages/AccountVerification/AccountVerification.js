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

// ACCOUNT VERIFICATION PAGE
// - tells user that his account is not verified and allows to send new verification email
function AccountVerification() {
    const auth = useAuth();

    // determines whether new token is being sent
    const [loading, setLoading] = useState(false);
    // determines whether an error occured
    const [isError, setIsError] = useState(false);
    // determines whether new token was sent
    const [newTokenSent, setNewTokenSent] = useState(false);

    // FUNCTION to send new verification email
    const sendNewVerificationToken = async () => {
        try {
            // new verification email is being sent
            setLoading(true);

            // send new verification email
            await axios.post(`${process.env.REACT_APP_API_URL}/users/resend-verification-token`, {}, auth.getHeaderConfig());

            // new verification email has been sent
            setNewTokenSent(true);
            setLoading(false);
        } catch(err) {
            // if user has already been verified
            if (err.response.status === 409) {
                try {
                    // get user by id from server
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${auth.currentUser.id}`, auth.getHeaderConfig());
                    // update logged in user (verification page disappears, because user is verified now)
                    auth.updateCurrentUser(res.data.user);
                } catch(err) {
                    // if something went wrong, error page is set
                    setIsError(true);
                }
                return;
            }

            // error page is set
            setIsError(true);
            setLoading(false);
        }
    }


    // if error occured, display error page
    if (isError) return <ErrorPage/>;

    // render verification page
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