import React from 'react';
import LinkButton from '../../components/Button/LinkButton';
import CenteredText from '../../components/CenteredText/CenteredText';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import IllustrativeIcon from '../../components/IllustrativeIcon/IllustrativeIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import Paragraph from '../../components/Paragraph/Paragraph';

// ERROR PAGE
// - can be used in other pages to be displayed when an error occurs
function ErrorPage() {
    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Došlo k chybě</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    <Paragraph bottomMargin={4}>Bohužel došlo k chybě. Omlouvám se za potíže.</Paragraph>
                    <IllustrativeIcon iconName="icon-bug" bottomMargin={6}/>
                    <LinkButton to="/">Odejít na hlavní stránku</LinkButton>
                </CenteredText>
            </PageLayoutCentered>
        </Page>
    );
}

export default ErrorPage;