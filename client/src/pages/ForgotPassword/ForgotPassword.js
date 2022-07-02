import axios from 'axios';
import React, { useState } from 'react';
import Button from '../../components/Button/Button';
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

// FORGOT PASSWORD PAGE
function ForgotPassword() {
    // holds username that the user writes into the text input
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    // errors
    const [error, setError] = useState(null); // general error
    const [errors, setErrors] = useState({}); // input errors (but on this page is just one input)

    // determines whether reset password email is being sent
    const [loading, setLoading] = useState(false);

    // FUNCTION to send reset password email
    const handleSubmit = async (e) => {
        // prevent default behavior when form is submited
        e.preventDefault();

        try {
            // reset password email is being sent
            setLoading(true);
            // send request to send reset password email
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                email: email
            });
            // reset password email has been sent
            setEmailSent(true);
        } catch(err) {
            // if an error occured, reset password email is no longed being sent
            setLoading(false);

            // get error data
            const errData = err.response.data;
            // if there are any input errors
            if (errData?.errors) {
                // set input errors
                setErrors(errData.errors);
                // unset general error
                setError(null);
            } else {
                // set general error
                setError(errData.error);
                // unset input errors
                setErrors({});
            }
        }
    }


    // render Forgot Password page
    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Zapomenuté heslo</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    {
                        emailSent
                        ? ( // if email was sent
                            <>
                                <Paragraph bottomMargin={4}>Na email ti byl zaslán odkaz pro vytvoření nového hesla. Tento odkaz je aktivní po dobu 15 minut.</Paragraph>
                                <IllustrativeIcon iconName="icon-key"/>
                            </>
                        )
                        : ( // else if user didn't send reset password email yet
                            <Form method="POST" onSubmit={handleSubmit}>
                                {error && <ErrorMessage>{error}</ErrorMessage>}
                                <InputDescription>
                                    <Label htmlFor="email">Email</Label>
                                    {errors.email && <InputError>{errors.email.msg}</InputError>}
                                </InputDescription>
                                <TextInput type="email" id="email" onChange={e => setEmail(e.target.value)} bottomMargin={6}/>
                                {
                                    loading
                                    ? <LoadIcon small/>
                                    : <Button fullWidth>Resetovat heslo</Button>
                                }
                            </Form>
                        )
                    }
                </CenteredText>
            </PageLayoutCentered>
        </Page>
    );
}

export default ForgotPassword;