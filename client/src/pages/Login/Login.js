import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary';
import CenteredText from '../../components/CenteredText/CenteredText';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Form from '../../components/Form/Form';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import HorizontalRuleWithText from '../../components/HorizontalRuleWithText/HorizontalRuleWithText';
import InputDescription from '../../components/InputDescription/InputDescription';
import InputError from '../../components/InputError/InputError';
import Label from '../../components/Label/Label';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import Paragraph from '../../components/Paragraph/Paragraph';
import RightAlignedText from '../../components/RightAlignedText/RightAlignedText';
import TextInput from '../../components/TextInput/TextInput';
import TextLink from '../../components/TextLink/TextLink';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);
            await auth.login(email, password);
            navigate("/");
        } catch(err) {
            setLoading(false);
            const errData = err.response.data;
            if (errData?.errors) {
                setErrors(errData.errors);
                setError(null);
            } else {
                setError(errData.error);
                setErrors({});
            }
        }
    }

    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Přihlášení</HeadingPrimary>
                    <HorizontalRule bottomMargin={6}/>
                    <ButtonSecondary to={`${process.env.REACT_APP_API_URL}/auth/google-login`} iconPath="/img/google-logo.svg">Přihlásit se přes Google</ButtonSecondary>
                    <VerticalSpace size={4}/>
                </CenteredText>
                <HorizontalRuleWithText bottomMargin={4}>Nebo</HorizontalRuleWithText>
                <Form method="POST" onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <InputDescription>
                        <Label htmlFor="email">Email</Label>
                        {errors.email && <InputError>{errors.email.msg}</InputError>}
                    </InputDescription>
                    <TextInput type="email" id="email" onChange={e => setEmail(e.target.value)} bottomMargin={4}/>
                    <InputDescription>
                        <Label htmlFor="password">Heslo</Label>
                        {errors.password && <InputError>{errors.password.msg}</InputError>}
                    </InputDescription>
                    <TextInput type="password" id="password" onChange={e => setPassword(e.target.value)} bottomMargin={6}/>
                    {
                        loading
                        ? <LoadIcon small/>
                        : <Button fullWidth>Přihlásit se</Button>
                    }
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