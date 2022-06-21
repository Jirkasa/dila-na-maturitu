import axios from 'axios';
import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import CenteredText from '../../components/CenteredText/CenteredText';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Form from '../../components/Form/Form';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import InputDescription from '../../components/InputDescription/InputDescription';
import InputError from '../../components/InputError/InputError';
import Label from '../../components/Label/Label';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import TextInput from '../../components/TextInput/TextInput';
import { useAuth } from '../../contexts/AuthContext';

function CreateUsername() {
    const auth = useAuth();

    const [username, setUsername] = useState("");

    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await axios.patch(`${process.env.REACT_APP_API_URL}/users/username`, {}, {
                params: {
                    username: username
                },
                ...auth.getHeaderConfig()
            });
            auth.updateCurrentUser(res.data.user);
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
                    <HeadingPrimary bottomMargin={4}>Vytvoření uživatelského jména</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                </CenteredText>
                <Form method="POST" onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <InputDescription>
                        <Label htmlFor="username">Uživatelské jméno</Label>
                        {errors.username && <InputError>{errors.username.msg}</InputError>}
                    </InputDescription>
                    <TextInput id="username" onChange={e => setUsername(e.target.value)} bottomMargin={4}/>
                    {
                        loading
                        ? <LoadIcon small/>
                        : <Button fullWidth>Vytvořit</Button>
                    }
                </Form>
            </PageLayoutCentered>
        </Page>
    );
}

export default CreateUsername;