import React from 'react'
import Button from '../../components/Button/Button';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary';
import CenteredText from '../../components/CenteredText/CenteredText';
import Form from '../../components/Form/Form';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import HorizontalRuleWithText from '../../components/HorizontalRuleWithText/HorizontalRuleWithText';
import InputDescription from '../../components/InputDescription/InputDescription';
import Label from '../../components/Label/Label';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import Paragraph from '../../components/Paragraph/Paragraph';
import RightAlignedText from '../../components/RightAlignedText/RightAlignedText';
import TextInput from '../../components/TextInput/TextInput';
import TextLink from '../../components/TextLink/TextLink';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';

function Login() {
    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Přihlášení</HeadingPrimary>
                    <HorizontalRule bottomMargin={6}/>
                    <ButtonSecondary to="/" iconPath="/img/google-logo.svg">Přihlásit se přes Google</ButtonSecondary>
                    <VerticalSpace size={4}/>
                </CenteredText>
                <HorizontalRuleWithText bottomMargin={4}>Nebo</HorizontalRuleWithText>
                <Form method="POST">
                    <InputDescription>
                        <Label htmlFor="email">Email</Label>
                    </InputDescription>
                    <TextInput type="email" id="email" bottomMargin={4}/>
                    <InputDescription>
                        <Label htmlFor="password">Heslo</Label>
                    </InputDescription>
                    <TextInput type="password" id="password" bottomMargin={6}/>
                    <Button fullWidth>Přihlásit se</Button>
                    <VerticalSpace size={2}/>
                    <RightAlignedText>
                        <Paragraph bottomMargin={4}><TextLink to="/">Zapomněl jsi heslo?</TextLink></Paragraph>
                    </RightAlignedText>
                </Form>
                <HorizontalRule bottomMargin={4}/>
                <CenteredText>
                    <Paragraph>Ještě nemáš účet? <TextLink to="/registrace">Vytvoř si jej</TextLink></Paragraph>
                </CenteredText>
            </PageLayoutCentered>
        </Page>
    );
}

export default Login;