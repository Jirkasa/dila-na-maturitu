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

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                email: email
            });
            setEmailSent(true);
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
                    <HeadingPrimary bottomMargin={4}>Zapomenuté heslo</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    {
                        emailSent
                        ? (
                            <>
                                <Paragraph bottomMargin={4}>Na email ti byl zaslán odkaz pro vytvoření nového hesla. Tento odkaz je aktivní po dobu 15 minut.</Paragraph>
                                <IllustrativeIcon iconName="icon-key"/>
                            </>
                        )
                        : (
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