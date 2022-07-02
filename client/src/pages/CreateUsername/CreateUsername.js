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

// CREATE USERNAME PAGE
function CreateUsername() {
    const auth = useAuth();

    // holds username that the user writes into the text input
    const [username, setUsername] = useState("");
    // errors
    const [error, setError] = useState(null); // general error
    const [errors, setErrors] = useState({}); // input errors (but on this page is just one input)
    // determines whether username is being updated on server
    const [loading, setLoading] = useState(false);

    // FUNCTION to submit username to server when user submits form
    const handleSubmit = async (e) => {
        // prevent default behavior when form is submited
        e.preventDefault();

        try {
            // username is being changed
            setLoading(true);
            // send request to change username to server
            const res = await axios.patch(`${process.env.REACT_APP_API_URL}/users/username`, {}, {
                params: {
                    username: username
                },
                ...auth.getHeaderConfig()
            });
            // update logged in user (user has new username)
            auth.updateCurrentUser(res.data.user);
        } catch(err) {
            // username is no longer being changed on server, because error has occured
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

    // render Create Username page
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