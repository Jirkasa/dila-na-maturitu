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

function DeleteMaterial() {
    const auth = useAuth();
    const navigate = useNavigate();
    const { materialId } = useParams();

    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    const [material, setMaterial] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials/${materialId}`, {
                    params: {
                        dontIncludeMaterialData: true
                    }
                });
    
                const material = res.data.material;
    
                if (material["user.id"] !== auth.currentUser.id) return setAccessDenied(true);
    
                setMaterial(material);
                setLoading(false);
            } catch(err) {
                if (err?.response?.status === 404) setNotFound(true);
                setIsError(true);
            }
        })();
    }, []);

    const deleteMaterial = async () => {
        try {
            setLoading(true);
            await axios.delete(`${process.env.REACT_APP_API_URL}/materials/${materialId}`, auth.getHeaderConfig());
            navigate("/moje-materialy");
        } catch(err) {
            setIsError(true);
        }
    }


    if (notFound) return <NotFoundPage/>;
    if (isError) return <ErrorPage/>;
    if (accessDenied) return <AccessDeniedPage/>;
    if (loading) return <LoadPage/>;

    return (
        <Page flex>
            <PageLayoutCentered>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Smazání materiálu</HeadingPrimary>
                    <HorizontalRule bottomMargin={4}/>
                    <Paragraph bottomMargin={4}>Opravdu si přeješ odstranit tento materiál?</Paragraph>
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