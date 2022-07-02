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

// PASSWORD RESET PAGE
function PasswordReset() {
    const navigate = useNavigate();

    // get reset token from params
    const {token} = useParams();

    // form fields
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // errors
    const [error, setError] = useState(null); // general error
    const [errors, setErrors] = useState({}); // input errors
    const [confirmPasswordError, setConfirmPasswordError] = useState(null); // confirm password error (because this is not valided on server)
    
    // determines whether page is being loaded
    const [pageLoading, setPageLoading] = useState(true);
    // determines whether password is being changed
    const [loading, setLoading] = useState(false);
    
    // determines whether password has been changed
    const [passwordChanged, setPasswordChanged] = useState(false);

    // FUNCTION to reset (change) password
    const handleSubmit = async (e) => {
        // prevent default behavior when form is submited
        e.preventDefault();

        // if password and confirm password values don't equal, confirm password error is set
        if (password !== confirmPassword) {
            setConfirmPasswordError("Zadaná hesla se neshodují");
            setErrors({});
            setError(null);
            return;
        }

        try {
            // password is being changed
            setLoading(true);
            // send request to reset password
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
                password: password,
                token: token
            });
            // password has been changed
            setLoading(false);
            setPasswordChanged(true);
        } catch(err) {
            // if an error occured, password is no longer being changed
            setLoading(false);

            // get error data
            const errData = err.response.data;
            // if there are any input errors
            if (errData?.errors) {
                // set input errors
                setErrors(errData.errors);
                // unset other errors
                setError(null);
                setConfirmPasswordError(null);
            } else {
                // set general error
                setError(errData.error);
                // unset other errors
                setErrors({});
                setConfirmPasswordError(null);
            }
        }
    }

    // called when page is rendered for the first time
    useEffect(() => {
        (async () => {
            try {
                // send request to check whether reset token is valid
                await axios.get(`${process.env.REACT_APP_API_URL}/auth/check-reset-token`, {
                    params: {
                        token: token
                    }
                });
                // reset token is valid, page has been loaded
                setPageLoading(false);
            } catch(err) {
                // if reset token is not valid, user is redirected to Home Page
                navigate("/");
            }
        })();
    }, []);


    // if page is being loaded, Loading Page is rendered
    if (pageLoading) return <LoadPage/>;

    // render Password Reset page
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