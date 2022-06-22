import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import LinkButton from '../../components/Button/LinkButton';
import CenteredText from '../../components/CenteredText/CenteredText';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Form from '../../components/Form/Form';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import IllustrativeIcon from '../../components/IllustrativeIcon/IllustrativeIcon';
import InputDescription from '../../components/InputDescription/InputDescription';
import InputError from '../../components/InputError/InputError';
import Label from '../../components/Label/Label';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import Paragraph from '../../components/Paragraph/Paragraph';
import TextInput from '../../components/TextInput/TextInput';
import LoadPage from '../LoadPage/LoadPage';

function PasswordReset() {
    const {token} = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setConfirmPasswordError("Zadaná hesla se neshodují");
            setErrors({});
            setError(null);
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
                password: password,
                token: token
            });
            setLoading(false);
            setPasswordChanged(true);
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
        }
    }

    useEffect(() => {
        (async () => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/auth/check-reset-token`, {
                    params: {
                        token: token
                    }
                });
                setPageLoading(false);
            } catch(err) {
                navigate("/");
            }
        })();
    }, []);


    if (pageLoading) return <LoadPage/>;

    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Reset hesla</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                </CenteredText>
                {
                    passwordChanged
                    ? (
                        <CenteredText>
                            <Paragraph bottomMargin={4}>Tvoje heslo bylo úspěšně změněno. Můžeš se přihlásit.</Paragraph>
                            <IllustrativeIcon iconName="icon-checkmark" bottomMargin={6}/>
                            <LinkButton to="/prihlaseni">Přihlásit se</LinkButton>
                        </CenteredText>
                    )
                    : (
                        <Form method="POST" onSubmit={handleSubmit}>
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            <InputDescription>
                                <Label htmlFor="password">Nové heslo</Label>
                                {errors.password && <InputError>{errors.password.msg}</InputError>}
                            </InputDescription>
                            <TextInput type="password" id="password" onChange={e => setPassword(e.target.value)} bottomMargin={4}/>
                            <InputDescription>
                                <Label htmlFor="confirmPassword">Nové heslo znovu</Label>
                                {confirmPasswordError && <InputError>{confirmPasswordError}</InputError>}
                            </InputDescription>
                            <TextInput type="password" id="confirmPassword" onChange={e => setConfirmPassword(e.target.value)} bottomMargin={6}/>
                            {
                                loading
                                ? <LoadIcon small/>
                                : <Button fullWidth>Potvrdit</Button>
                            }
                        </Form>
                    )
                }
            </PageLayoutCentered>
        </Page>
    )
}

export default PasswordReset;