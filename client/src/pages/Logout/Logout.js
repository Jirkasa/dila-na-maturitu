import React, { useEffect, useState } from 'react';
import LinkButton from '../../components/Button/LinkButton';
import CenteredText from '../../components/CenteredText/CenteredText';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import IllustrativeIcon from '../../components/IllustrativeIcon/IllustrativeIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import Paragraph from '../../components/Paragraph/Paragraph';
import { useAuth } from '../../contexts/AuthContext';
import ErrorPage from '../ErrorPage/ErrorPage';
import LoadPage from '../LoadPage/LoadPage';

// LOGOUT PAGE
function Logout() {
    const auth = useAuth();

    // determines whether user is being logged out
    const [loading, setLoading] = useState(true);
    // determines whether Error Page should be displayed
    const [isError, setIsError] = useState(false);

    // called when page is rendered for the first time
    useEffect(() => {
        (async () => {
            try {
                // logout user
                await auth.logout();
                // user has been logged out
                setLoading(false);
            } catch(err) {
                // if an error occured, Error Page is displayed
                setIsError(true);
            }
        })();
    }, []);

    // determines which page should be rendered
    let pageToRender;
    if (isError) {
        // if an error occured, Error Page is displayed
        pageToRender = <ErrorPage/>;
    } else if (loading) {
        // if user is being logged out, Loading Page is displayed
        pageToRender = <LoadPage/>;
    } else {
        // if user has been succesfully logged out, Logout Page is displayed
        pageToRender = <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Byl jsi odhlášen</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    <Paragraph bottomMargin={4}>Byl jsi úspěšně odhlášen. Můžeš odejít na hlavní stránku.</Paragraph>
                    <IllustrativeIcon iconName="icon-exit" bottomMargin={6}/>
                    <LinkButton to="/">Odejít na hlavní stránku</LinkButton>
                </CenteredText>
            </PageLayoutCentered>
        </Page>
    }

    // render page
    return pageToRender;
}

export default Logout;