import React from 'react';
import LoadIcon from '../../components/LoadIcon/LoadIcon';
import Page from '../../components/Page/Page';
import PageLayoutCentered from '../../components/PageLayoutCentered/PageLayoutCentered';

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