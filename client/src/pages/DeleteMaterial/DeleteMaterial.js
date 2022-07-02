import './DeleteMaterial.scss';

import React, { useEffect, useState } from 'react';
import CenteredText from '../../components/CenteredText/CenteredText';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';
import Paragraph from '../../components/Paragraph/Paragraph';
import CenteredFlexRow from '../../components/CenteredFlexRow/CenteredFlexRow';
import LinkButton from '../../components/Button/LinkButton';
import Button from '../../components/Button/Button';
import LoadPage from '../LoadPage/LoadPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';

// DELETE MATERIAL PAGE
function DeleteMaterial() {
    const auth = useAuth();
    const navigate = useNavigate();

    // get material ID from params
    const { materialId } = useParams();

    // determines whether material is loading or being removed
    const [loading, setLoading] = useState(true);
    // determines whether an error has occured
    const [isError, setIsError] = useState(false);
    // determines whether material wasn't found
    const [notFound, setNotFound] = useState(false);
    // determines whether user doesn't right to delete material
    const [accessDenied, setAccessDenied] = useState(false);

    // stores material
    const [material, setMaterial] = useState(null);

    // called when page is rendered for the first time
    useEffect(() => {
        (async () => {
            try {
                // send request to get material from server
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials/${materialId}`, {
                    params: {
                        dontIncludeMaterialData: true
                    }
                });
                // get material from response
                const material = res.data.material;
    
                // if user is not owner of this material, he doesn't have right to delete this material
                if (material["user.id"] !== auth.currentUser.id) return setAccessDenied(true);
    
                // store material in state
                setMaterial(material);
                // material was loaded
                setLoading(false);
            } catch(err) {
                // if material wasn't found on server, not found page is displayed
                if (err?.response?.status === 404) setNotFound(true);
                // if any other orror has occured, error page is displayed
                setIsError(true);
            }
        })();
    }, []);

    // FUNCTION to delete material
    const deleteMaterial = async () => {
        try {
            // material is being deleted
            setLoading(true);
            // send request to delete material
            await axios.delete(`${process.env.REACT_APP_API_URL}/materials/${materialId}`, auth.getHeaderConfig());
            // redirect user to My Materials page
            navigate("/moje-materialy");
        } catch(err) {
            // if something went wrong, error page is displayed
            setIsError(true);
        }
    }


    // if material wasn't found, Not Found Page is rendered
    if (notFound) return <NotFoundPage/>;
    // if an error occured, Error Page is rendered
    if (isError) return <ErrorPage/>;
    // if user does not have right to delete this material, Access Denied Page is rendered
    if (accessDenied) return <AccessDeniedPage/>;
    // if material is being loaded or deleted, Load Page is rendered
    if (loading) return <LoadPage/>;

    // render Delete Material Page
    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Smazání materiálu</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    <Paragraph bottomMargin={4}>Opravdu si přeješ smazat tento materiál?</Paragraph>
                    <h2 className='DeleteMaterial__title'>{material.title}</h2>
                    <h3 className='DeleteMaterial__author'>{material.author}</h3>
                    <HorizontalRule bottomMargin={6}/>
                    <CenteredFlexRow>
                        <LinkButton outlined to="/moje-materialy">Ne</LinkButton>
                        <Button onClick={deleteMaterial}>Ano</Button>
                    </CenteredFlexRow>
                </CenteredText>
            </PageLayoutCentered>
        </Page>
    );
}

export default DeleteMaterial;