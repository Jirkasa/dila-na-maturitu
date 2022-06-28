import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LinkButton from '../../components/Button/LinkButton';
import CenteredFlexRow from '../../components/CenteredFlexRow/CenteredFlexRow';
import CenteredText from '../../components/CenteredText/CenteredText';
import CloseButton from '../../components/CloseButton/CloseButton';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import HorizontalRule from '../../components/HorizontalRule/HorizontalRule';
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

function MyMaterials() {
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

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/${auth.currentUser.id}/materials`, {
                params: {
                    page: page,
                    limit: config.MATERIAL_PAGE_SIZE,
                    search: search
                },
                ...auth.getHeaderConfig()
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
            materialAuthor={auth.currentUser.username}
            showOptions
        />
    ));

    let html;
    if (loading) {
        html = <LoadIcon/>;
    } else {
        html = (
            <>
                <CenteredFlexRow>
                    <LinkButton iconName="icon-plus" to="/vytvoreni-materialu">Vytvořit materiál</LinkButton>
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
                <Pagination
                    activePage={currentPage}
                    pageCount={pageCount}
                    selectPage={loadMaterials}
                    selectPrevPage={() => loadMaterials(currentPage-1)}
                    selectNextPage={() => loadMaterials(currentPage+1)}
                />
            </>
        );
    }

    return (
        <Page flex>
            <PageLayoutLeft>
                <CenteredText>
                    <HeadingPrimary bottomMargin={4}>Moje materiály</HeadingPrimary>
                </CenteredText>
                <HorizontalRule bottomMargin={4}/>
                {html}
            </PageLayoutLeft>
        </Page>
    );
}

export default MyMaterials;