import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import LinkButton from '../../components/Button/LinkButton';
import CenteredFlexRow from '../../components/CenteredFlexRow/CenteredFlexRow';
import CenteredText from '../../components/CenteredText/CenteredText';
import CloseButton from '../../components/CloseButton/CloseButton';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
import IllustrativeIcon from '../../components/IllustrativeIcon/IllustrativeIcon';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import MaterialCard from '../../components/MaterialCard/MaterialCard';
import Page from '../../components/Page/Page';
import PageLayoutLeft from '../../components/PageLayoutLeft/PageLayoutLeft';
import Pagination from '../../components/Pagination/Pagination';
import Paragraph from '../../components/Paragraph/Paragraph';
import SearchBar from '../../components/SearchBar/SearchBar';
import VerticalSpace from '../../components/VerticalSpace/VerticalSpace';
import config from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import ErrorPage from '../ErrorPage/ErrorPage';

// MATERIALS PAGE
function Materials() {
    const auth = useAuth();
    
    // determines whether materials are being loaded for the first time
    const [loading, setLoading] = useState(true);
    // determines whether materials are being loaded
    const [materialsLoading, setMaterialsLoading] = useState(false);

    // determines whether Error Page should be displayed
    const [isError, setIsError] = useState(false);

    // here is stored search text (if user wants to search materials)
    const [searchText, setSearchText] = useState("");
    // here is stored page that the user is currently on
    const [currentPage, setCurrentPage] = useState(1);
    // here is stored how many pages of materials there are
    const [pageCount, setPageCount] = useState(0);

    // here are stored materials fetched from server
    const [materials, setMaterials] = useState([]);

    // FUNCTION to load materials from server
    // - page = page to load materials for
    // - search = text to filter materials (search for materials)
    const loadMaterials = async (page, search=searchText) => {
        try {
            // materials are being fetched from server
            setMaterialsLoading(true);

            // create request config
            const requestConfig = {
                params: {
                    page: page, // page to load materials for
                    limit: config.MATERIAL_PAGE_SIZE, // max number of materials per page
                    search: search // search text
                }
            }
            // if user is logged in, add to request config authorization header
            // - materials will be loaded with information whether user likes material or not
            if (auth.currentUser) requestConfig.headers = auth.getHeaderConfig().headers;

            // send request to get liked materials from server
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials`, requestConfig);

            // create new query parameters
            const queryParams = new URLSearchParams(window.location.search);
            // set page parameter to query parameters
            queryParams.set("page", page);
            // add or remove search parameter from query parameters
            if (search) {
                queryParams.set("search", search);
            } else {
                queryParams.delete("search");
            }
            // change query parameters
            window.history.pushState(null, null, "?"+queryParams.toString());

            // store fetched materials
            setMaterials(res.data.materials);

            // store current page, search text and page count
            setCurrentPage(res.data.page);
            setSearchText(search);
            setPageCount(res.data.pageCount);

            // materials have been fetched
            setMaterialsLoading(false);
            setLoading(false);
        } catch(err) {
            // if an error occured, Error Page is displayed
            setIsError(true);
        }
    }

    // FUNCTION to search for materials (load materials using search text)
    const handleSearch = (search) => loadMaterials(1, search);

    // FUNCTION to clear search (load materials without search text)
    const clearSearch = () => loadMaterials(1, "");

    // called when page is rendered for the first time
    useEffect(() => {
        // create new query parameters
        const queryParams = new URLSearchParams(window.location.search);
        // get page and search text from query parameters
        const page = queryParams.get("page") || currentPage;
        const search = queryParams.get("search") || searchText;

        // load materials using page and search from query parameters
        loadMaterials(page, search);
    }, []);

    // FUNCTION to like material
    const likeMaterial = async (materialId) => {
        // create new array of materials (because state is going to be updated)
        const newMaterials = [...materials];
        // update material that the user liked to be liked
        for (let material of newMaterials) {
            if (material.id === materialId) material.liked = true;
        }
        // update state
        setMaterials(newMaterials);

        try {
            // send request to like material
            await axios.post(`${process.env.REACT_APP_API_URL}/materials/${materialId}/like`, {}, auth.getHeaderConfig());
        } catch(err) {
            // if an error occured, Error Page is displayed
            setIsError(true);
        }
    }

    // FUNCTION to unlike material
    const unlikeMaterial = async (materialId) => {
        // create new array of materials (because state is going to be updated)
        const newMaterials = [...materials];
        // update material that the user unliked to be not liked
        for (let material of newMaterials) {
            if (material.id === materialId) material.liked = false;
        }
        // update state
        setMaterials(newMaterials);

        try {
            // send request to unlike material
            await axios.delete(`${process.env.REACT_APP_API_URL}/materials/${materialId}/like`, auth.getHeaderConfig());
        } catch(err) {
            // if an error occured, Error Page is displayed
            setIsError(true);
        }
    }


    // if an error occured, Error Page is rendered
    if (isError) return <ErrorPage/>;

    // create material cards for materials to be rendered to page
    const materialCards = materials.map(mat => (
        <MaterialCard
            key={mat.id}
            id={mat.id}
            title={mat.title}
            author={mat.author}
            testable={mat.testable}
            materialAuthor={mat["user.username"]}
            showLikeOption={auth.currentUser}
            liked={mat.liked}
            like={likeMaterial}
            unlike={unlikeMaterial}
        />
    ));

    // determine what should be displayed on page
    let html;
    if (loading) {
        // if materials are being loaded for the first time, load icon is displayed
        html = <LoadIcon/>;
    } else if (!materialsLoading && materialCards.length === 0 && currentPage === 1 && searchText === "") {
        // if user is on the first page and no materials are available, no materials have been created yet
        html = (
            <CenteredText>
                <Paragraph bottomMargin={4}>Ještě nejsou vytvořeny žádné materiály. Buď první!</Paragraph>
                <IllustrativeIcon iconName="icon-tongue" bottomMargin={6}/>
                {
                    auth.currentUser
                    ? <LinkButton to="/vytvoreni-materialu">Vytvořit materiál</LinkButton>
                    : <LinkButton to="/registrace">Zaregistrovat se</LinkButton>
                }
            </CenteredText>
        );
    } else if (!materialsLoading && materialCards.length === 0 && currentPage === 1) {
        // if user tried to search for materials, but nothing was found, message that nothing was found is displayed
        html = (
            <>
                <CenteredFlexRow>
                    {auth.currentUser && <LinkButton iconName="icon-plus" to="/vytvoreni-materialu">Vytvořit materiál</LinkButton>}
                    <SearchBar search={handleSearch} placeholder="Vyhledat materiál..."/>
                </CenteredFlexRow>
                <VerticalSpace size={4}/>
                <HorizontalRule bottomMargin={2}/>
                <CenteredFlexRow smallGap>
                    <Paragraph><b>Výsledky hledání pro: </b>{searchText}</Paragraph>
                    <CloseButton onClick={clearSearch}>odstranit vyhledávání</CloseButton>
                </CenteredFlexRow>
                <VerticalSpace size={2}/>
                <HorizontalRule bottomMargin={4}/>
                <CenteredText>
                    <Paragraph bottomMargin={4}>Nic se nenašlo.</Paragraph>
                    <IllustrativeIcon iconName="icon-search" bottomMargin={6}/>
                    <Button onClick={clearSearch}>Vymazat hledání</Button>
                </CenteredText>
            </>
        );
    } else if (!materialsLoading && materialCards.length === 0 && currentPage !== 1) {
        // if user is on a page other than the first one and no materials are available, message that there are no materials on this page is displayed
        html = (
            <CenteredText>
                <Paragraph bottomMargin={4}>Na této stránce nic není.</Paragraph>
                <IllustrativeIcon iconName="icon-tongue" bottomMargin={6}/>
                <Button onClick={clearSearch}>Přejít na první stránku</Button>
            </CenteredText>
        );
    } else {
        // else material cards are displayed
        html = (
            <>
                <CenteredFlexRow>
                    {auth.currentUser && <LinkButton iconName="icon-plus" to="/vytvoreni-materialu">Vytvořit materiál</LinkButton>}
                    <SearchBar search={handleSearch} placeholder="Vyhledat materiál..."/>
                </CenteredFlexRow>
                <VerticalSpace size={4}/>
                {
                    searchText && // if user searched for materials, part to delete search is displayed
                    (
                        <>
                            <HorizontalRule bottomMargin={2}/>
                            <CenteredFlexRow smallGap>
                                <Paragraph><b>Výsledky hledání pro: </b>{searchText}</Paragraph>
                                <CloseButton onClick={clearSearch}>odstranit vyhledávání</CloseButton>
                            </CenteredFlexRow>
                            <VerticalSpace size={2}/>
                        </>
                    )
                }
                <HorizontalRule bottomMargin={4}/>
                {materialsLoading && <LoadIcon/>}
                {!materialsLoading && materialCards}
                {
                    !materialsLoading && (
                        <Pagination
                            activePage={currentPage}
                            pageCount={pageCount}
                            selectPage={loadMaterials}
                            selectPrevPage={() => loadMaterials(currentPage-1)}
                            selectNextPage={() => loadMaterials(currentPage+1)}
                        />
                    )
                }
            </>
        );
    }

    // render Materials page
    return (
        <Page flex>
            <PageLayoutLeft>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Materiály</HeadingPrimary>
                </CenteredText>
                <HorizontalRule bottomMargin={4}/>
                {html}
            </PageLayoutLeft>
        </Page>
    );
}

export default Materials;