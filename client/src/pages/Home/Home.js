import './Home.scss';

import React from 'react';
import Page from '../../components/Page/Page';
import Paragraph from '../../components/Paragraph/Paragraph';
import LinkButton from '../../components/Button/LinkButton';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import CenteredText from '../../components/CenteredText/CenteredText';
import ColumnPattern from '../../components/ColumnPattern/ColumnPattern';
import VideoSection from './VideoSection';
import Survey from '../../components/Survey/Survey';

// HOME PAGE
function Home() {
    return (
        <Page>
            <section className='Home__intro-section'>
                <div>
                    <div className='Home__intro-section-content'>
                        <h1 className='Home__intro-headline'>Prozkoumej materiály na ústní maturitu z češtiny</h1>
                        <Paragraph bottomMargin={8}>Potřebuješ se naučit na ústní maturitu z češtiny? Tak to jsi tu správně. Najdeš tu materiály, které ti v tom mohou pomoct. Hlavně se to ale uč jen natolik, abys udělal/a maturitu, protože v reálném životě to stejně vůbec nevyužiješ. Po maturitě by tě potom mohlo štvát, že jsi ten čas nevěnoval/a něčemu smysluplnějšímu...</Paragraph>
                        <LinkButton iconName="icon-search" to="/materialy">Prozkoumat materiály</LinkButton>
                    </div>
                </div>
            </section>
            <section className='Home__section'>
                <div>
                    <ColumnPattern/>
                    <div className='Home__section-content'>
                        <CenteredText>
                            <HeadingPrimary bottomMargin={6} asH2>Proč jsem tento web vytvořil</HeadingPrimary>
                        </CenteredText>
                        <Paragraph bottomMargin={4}>Tento web jsem se rozhodl vytvořit, protože jsem se potřeboval naučit na ústní maturitu z češtiny. Nechtěl jsem se ale tyto pro mě zbytečné věci učit jen kvůli maturitě. Chtěl jsem po sobě alespoň něco zanechat, když už jsem se to měl učit. Napadlo mě tedy vytvořit tento web, abych tak mohl pomoct naučit se na ústní maturitu z češtiny i jiným lidem a měl pocit že dělám něco smysluplného, než že se jen něco slepě učím, protože to po mě někdo chce.</Paragraph>
                        <Paragraph bottomMargin={4}>Je podle mě důležité si uvědomit, že i když se nás ve škole snaží učit spoustu věcí, které vůbec nepotřebujeme znát a jsou pro nás zbytečné, tak je ve finále jen na nás, jestli se je opravdu naučíme. Neučte se slepě každou věc, kterou vám ve škole předhodí. Já jsem měl například ve škole občas dobrý pocit, když jsem se nenaučil na test a dostal z něj za pět. Pokud bych se naopak na test naučil a dostal za jedna, tak bych měl v některých případech naopak spíš špatný pocit z toho, že jen slepě poslouchám rozkazy. Rozvíjejte se sami ve věcech, které vás zajímají. Učte se pro sebe, ne pro dobré známky.</Paragraph>
                        <Paragraph>Pokud byste ale rádi udělali ústní maturitu z češtiny, tak se na ni budete muset alespoň trochu připravit. S tím vám z části může pomoci tento web. Ústní maturita z češtiny se skládá ze tří částí: Analýza uměleckého textu, Literarněhistorický kontext a Analýza neuměleckého textu. Můžete se tu naučit na první dvě části, ale analýzu neuměleckého textu se již budete muset naučit někde jinde.</Paragraph>
                    </div>
                    <ColumnPattern/>
                </div>
            </section>
            <section className='Home__videos-section'>
                <div className='Home__videos-section-content'>
                    <CenteredText>
                        <HeadingPrimary bottomMargin={6} asH2>Jak probíhá ústní maturita z češtiny</HeadingPrimary>
                        <div className='Home__intro-text'>
                            <Paragraph bottomMargin={8}>Zajímá vás jak probíhá ústní maturita z češtiny? Na YouTube jsem našel dvě videa, na která se můžete podívat. Po jejich shlédnutí mi přijde smutné že se něco takového učíme...</Paragraph>
                        </div>
                    </CenteredText>
                    <VideoSection
                        title="Král Lávra"
                        author="Karel Havlíček Borovský"
                        videoURL="https://www.youtube.com/watch?v=TwkHEo4aP2g"
                        worksheetURL="https://uloz.to/file/bGxgMZymjQv9/kral-lavra-pracovni-list-pdf"
                        bottomMargin={8}
                    />
                    <VideoSection
                        title="Umina verze"
                        author="Emil Hakl"
                        videoURL="https://www.youtube.com/watch?v=vtXRXB5j3WU"
                        worksheetURL="https://uloz.to/file/jgnKeKa5VlbY/umina-verze-pracovni-list-pdf"
                    />
                </div>
            </section>
            <section className='Home__section'>
                <div>
                    <ColumnPattern/>
                    <div className='Home__section-content'>
                        <CenteredText>
                            <HeadingPrimary bottomMargin={6} asH2>Anketa</HeadingPrimary>
                            <Paragraph bottomMargin={8}>Za mě literatura na maturitní zkoušku rozhodně nepatří, protože je to jen o tom si zapamatovat informace, které většina lidí po maturitě zapomene. Pokud se chcete něco naučit, tak to musíte pochopit, ne si to zapamatovat. Chtěl jsem ale zjistit, co si o tom myslí jiní lidé. Proto jsem tu vytvořil anketu, ve které zaregistrovaní uživatelé mohou hlasovat, jestli si myslí že literatura na maturitu patří nebo ne.</Paragraph>
                        </CenteredText>
                        <Survey/>
                    </div>
                    <ColumnPattern/>
                </div>
            </section>
        </Page>
    );
}

export default Home;