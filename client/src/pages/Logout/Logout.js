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

function Logout() {
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await auth.logout();
                setLoading(false);
            } catch(err) {
                setIsError(true);
            }
        })();
    }, []);

    let pageToRender;
    if (isError) {
        pageToRender = <ErrorPage/>;
    } else if (loading) {
        pageToRender = <LoadPage/>;
    } else {
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

    return pageToRender;
}

export default Logout;