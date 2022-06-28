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

function Materials() {
    const auth = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [materialsLoading, setMaterialsLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [materials, setMaterials] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const loadMaterials = async (page, search=searchText) => {
        try {
            setMaterialsLoading(true);

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/materials`, {
                params: {
                    page: page,
                    limit: config.MATERIAL_PAGE_SIZE,
                    search: search
                }
            });

            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set("page", page);
            if (search) {
                queryParams.set("search", search);
            } else {
                queryParams.delete("search");
            }
            window.history.pushState(null, null, "?"+queryParams.toString());

            setMaterials(res.data.materials);
            setCurrentPage(res.data.page);
            setSearchText(search);
            setPageCount(res.data.pageCount);

            setMaterialsLoading(false);
            setLoading(false);
        } catch(err) {
            setIsError(true);
        }
    }

    const handleSearch = (search) => loadMaterials(1, search);

    const clearSearch = () => loadMaterials(1, "");

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const page = queryParams.get("page") || currentPage;
        const search = queryParams.get("search") || searchText;

        loadMaterials(page, search);
    }, []);


    if (isError) return <ErrorPage/>;

    const materialCards = materials.map(mat => (
        <MaterialCard
            key={mat.id}
            id={mat.id}
            title={mat.title}
            author={mat.author}
            testable={mat.testable}
            materialAuthor={mat["user.username"]}
        />
    ));

    let html;
    if (loading) {
        html = <LoadIcon/>;
    } else if (!materialsLoading && materialCards.length === 0 && currentPage === 1 && searchText === "") {
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
        html = (
            <CenteredText>
                <Paragraph bottomMargin={4}>Na této stránce nic není.</Paragraph>
                <IllustrativeIcon iconName="icon-tongue" bottomMargin={6}/>
                <Button onClick={clearSearch}>Přejít na první stránku</Button>
            </CenteredText>
        );
    } else {
        html = (
            <>
                <CenteredFlexRow>
                    {auth.currentUser && <LinkButton iconName="icon-plus" to="/vytvoreni-materialu">Vytvořit materiál</LinkButton>}
                    <SearchBar search={handleSearch} placeholder="Vyhledat materiál..."/>
                </CenteredFlexRow>
                <VerticalSpace size={4}/>
                {
                    searchText &&
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