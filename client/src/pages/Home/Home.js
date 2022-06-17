import './Home.scss';

import React from 'react';
import Page from '../../components/Page/Page';
import Paragraph from '../../components/Paragraph/Paragraph';
import Button from '../../components/Button/Button';
import LinkButton from '../../components/Button/LinkButton';

function Home() {
    return (
        <Page>
            <section className='Home__intro-section'>
                <div className='Home__intro-section-content'>
                    <h1 className='Home__intro-headline'>Prozkoumej spoustu materiálů na ústní maturitu z češtiny</h1>
                    <Paragraph bottomMargin={8}>Potřebuješ se naučit na ústní maturitu z češtiny? Tak to jsi tu správně. Najdeš tu spoustu materiálů, které ti v tom mohou pomoct. Hlavně se to ale uč jen natolik, abys udělal/a maturitu, protože v reálném životě to stejně vůbec nevyužiješ. Po maturitě by tě potom mohlo štvát, že jsi ten čas nevěnoval/a něčemu smysluplnějšímu...</Paragraph>
                    <LinkButton iconName="icon-search" to="/materialy">Prozkoumat materiály</LinkButton>
                </div>
            </section>
        </Page>
    );
}

export default Home;