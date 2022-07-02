import React from 'react';
import LinkButton from '../../components/Button/LinkButton';
import CenteredText from '../../components/CenteredText/CenteredText';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import IllustrativeIcon from '../../components/IllustrativeIcon/IllustrativeIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import Paragraph from '../../components/Paragraph/Paragraph';

// NOT FOUND PAGE
// - can also be used in other pages to be displayed when something is not found
function NotFoundPage() {
    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>404 - Nenalezeno</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    <Paragraph bottomMargin={4}>Tato stránka nebyla nalezena.</Paragraph>
                    <IllustrativeIcon iconName="icon-tongue" bottomMargin={6}/>
                    <LinkButton to="/">Odejít na hlavní stránku</LinkButton>
                </CenteredText>
            </PageLayoutCentered>
        </Page>
    );
}

export default NotFoundPage;