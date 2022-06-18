import React from 'react';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import CenteredText from '../../components/CenteredText/CenteredText';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary';
import HorizontalRuleWithText from '../../components/HorizontalRuleWithText/HorizontalRuleWithText';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';
import TextInput from '../../components/TextInput/TextInput';
import Form from '../../components/Form/Form';
import Label from '../../components/Label/Label';
import InputDescription from '../../components/InputDescription/InputDescription';
import Button from '../../components/Button/Button';

function Registration() {
    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Registrace</HeadingPrimary>
                    <HorizontalRule bottomMargin={6}/>
                    <ButtonSecondary to="/" iconPath="/img/google-logo.svg">Zaregistrovat se přes Google</ButtonSecondary>
                    <VerticalSpace size={4}/>
                </CenteredText>
                <HorizontalRuleWithText bottomMargin={4}>Nebo</HorizontalRuleWithText>
                <Form method="POST">
                    <InputDescription>
                        <Label htmlFor="username">Uživatelské jméno</Label>
                    </InputDescription>
                    <TextInput id="username" bottomMargin={4}/>
                    <InputDescription>
                        <Label htmlFor="email">Email</Label>
                    </InputDescription>
                    <TextInput type="email" id="email" bottomMargin={4}/>
                    <InputDescription>
                        <Label htmlFor="password">Heslo</Label>
                    </InputDescription>
                    <TextInput type="password" id="password" bottomMargin={4}/>
                    <InputDescription>
                        <Label htmlFor="confirm-password">Heslo znovu</Label>
                    </InputDescription>
                    <TextInput type="password" id="confirm-password" bottomMargin={6}/>
                    <Button fullWidth>Vytvořit účet</Button>
                </Form>
            </PageLayoutCentered>
        </Page>
    );
}

export default Registration;