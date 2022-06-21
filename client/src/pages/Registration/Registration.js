import React, { useState } from 'react';
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
import axios from 'axios';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import InputError from '../../components/InputError/InputError';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Registration() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (password !== confirmPassword) {
            setConfirmPasswordError("Zadaná hesla se neshodují");
            setErrors({});
            setError(null);
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
                username: username,
                email: email,
                password: password
            });
        } catch(err) {
            setLoading(false);
            const errData = err.response.data;
            if (errData?.errors) {
                setErrors(errData.errors);
                setError(null);
                setConfirmPasswordError(null);
            } else {
                setError(errData.error);
                setErrors({});
                setConfirmPasswordError(null);
            }
            return;
        }

        // login user after registration and redirect to home page
        try {
            await auth.login(email, password);
            navigate("/");
        } catch(err) {
            // if login failed, redirect user to login page
            navigate("/prihlaseni");
        }
    }

    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Registrace</HeadingPrimary>
                    <HorizontalRule bottomMargin={6}/>
                    <ButtonSecondary to={`${process.env.REACT_APP_API_URL}/auth/google-login`} iconPath="/img/google-logo.svg">Zaregistrovat se přes Google</ButtonSecondary>
                    <VerticalSpace size={4}/>
                </CenteredText>
                <HorizontalRuleWithText bottomMargin={4}>Nebo</HorizontalRuleWithText>
                <Form method="POST" onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <InputDescription>
                        <Label htmlFor="username">Uživatelské jméno</Label>
                        {errors.username && <InputError>{errors.username.msg}</InputError>}
                    </InputDescription>
                    <TextInput id="username" onChange={e => setUsername(e.target.value)} bottomMargin={4}/>
                    <InputDescription>
                        <Label htmlFor="email">Email</Label>
                        {errors.email && <InputError>{errors.email.msg}</InputError>}
                    </InputDescription>
                    <TextInput type="email" id="email" onChange={e => setEmail(e.target.value)} bottomMargin={4}/>
                    <InputDescription>
                        <Label htmlFor="password">Heslo</Label>
                        {errors.password && <InputError>{errors.password.msg}</InputError>}
                    </InputDescription>
                    <TextInput type="password" id="password" onChange={e => setPassword(e.target.value)} bottomMargin={4}/>
                    <InputDescription>
                        <Label htmlFor="confirm-password">Heslo znovu</Label>
                        {confirmPasswordError && <InputError>{confirmPasswordError}</InputError>}
                    </InputDescription>
                    <TextInput type="password" id="confirm-password" onChange={e => setConfirmPassword(e.target.value)} bottomMargin={6}/>
                    {
                        loading
                        ? <LoadIcon small/>
                        : <Button fullWidth>Vytvořit účet</Button>
                    }
                </Form>
            </PageLayoutCentered>
        </Page>
    );
}

export default Registration;