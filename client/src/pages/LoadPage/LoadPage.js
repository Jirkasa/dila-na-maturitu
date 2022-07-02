import React from 'react';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';

// LOAD PAGE
// - can be used in other pages to be displayed when something is loading
function LoadPage() {
    return (
        <Page flex>
            <PageLayoutCentered>
                <LoadIcon/>
            </PageLayoutCentered>
        </Page>
    );
}

export default LoadPage;