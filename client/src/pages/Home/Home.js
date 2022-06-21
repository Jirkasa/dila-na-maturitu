import './Home.scss';

import React from 'react';
import Page from '../../components/Page/Page';
import Paragraph from '../../components/Paragraph/Paragraph';
import Button from '../../components/Button/Button';
import LinkButton from '../../components/Button/LinkButton';
import HeadingPrimary from '../../components/HeadingPrimary/HeadingPrimary';
import CenteredText from '../../components/CenteredText/CenteredText';
import ColumnPattern from '../../components/ColumnPattern/ColumnPattern';
import VideoSection from './VideoSection';

function Home() {
    return (
        <Page>
            <section className='Home__intro-section'>
                <div>
                    <div className='Home__intro-section-content'>
                        <h1 className='Home__intro-headline'>Prozkoumej spoustu materiálů na ústní maturitu z češtiny</h1>
                        <Paragraph bottomMargin={8}>Potřebuješ se naučit na ústní maturitu z češtiny? Tak to jsi tu správně. Najdeš tu spoustu materiálů, které ti v tom mohou pomoct. Hlavně se to ale uč jen natolik, abys udělal/a maturitu, protože v reálném životě to stejně vůbec nevyužiješ. Po maturitě by tě potom mohlo štvát, že jsi ten čas nevěnoval/a něčemu smysluplnějšímu...</Paragraph>
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
                        <Paragraph bottomMargin={4}>Tento web jsem se rozhodl vytvořit, protože jsem se potřeboval naučit na ústní maturitu z češtiny. Nechtěl jsem se ale tyto bezvýznamné věci učit jen kvůli maturitě. Chtěl jsem po sobě alespoň něco zanechat když už jsem se to měl učit. Napadlo mě tedy vytvořit tento web, abych tak mohl pomoci naučit se na ústní maturitu z češtiny i ostatním lidem a měl pocit že dělám něco užitečného, než že se jen něco slepě učím, protože to po mě někdo chce.</Paragraph>
                        <Paragraph bottomMargin={4}>Je podle mě důležité si uvědomit, že i když se nás ve škole snaží učit spoustu věcí, které vůbec nepotřebujeme znát a jsou pro nás zbytečné, tak je ve finále jen na nás, jestli se je opravdu naučíme. Neučte se slepě každou věc, kterou vám ve škole řeknou. Já mám občas velmi dobrý pocit, když se například nenaučím na test a dostanu z něj za pět. Dává mi to pocit, že mám nad sebou kontrolu a neposlouchám jen slepě rozkazy. Pokud bych se naopak na test naučil a dostal za jedna, tak bych měl v některých případech naopak spíš špatný pocit. Rozvíjejte se sami ve věcech, které vás zajímají. Učte se pro sebe, ne pro dobré známky.</Paragraph>
                        <Paragraph bottomMargin={4}>Vzdělávací systém se dle mého názoru potřebuje dost změnit. Namísto zbytečných věcí jako je literatura by se měla ve školách učit například první pomoc. Myslím že spoustu lidí ji neumí vůbec poskytnout. Patřím mezi ně v době tvorby tohoto webu i já a nebojím se to tu veřejně napsat.</Paragraph>
                        <Paragraph>Pokud jsem předchozím textem nějak negativně ovlivnil váš vztah ke škole, tak se omlouvám. Potřeboval jsem to sem napsat abyste si nemysleli, že když jsem tento web vytvořil, tak mám k češtině dobrý vztah. Je to přesně naopak.</Paragraph>
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
                            <Paragraph>Za mě literatura na maturitní zkoušku rozhodně nepatří. Chtěl jsem ale zjistit, co si o tom myslí jiní lidé. Proto jsem tu vytvořil anketu, ve které zaregistrovaní uživatelé mohou hlasovat, jestli si myslí že literatura na maturitu patří nebo ne.</Paragraph>
                        </CenteredText>
                    </div>
                    <ColumnPattern/>
                </div>
            </section>
        </Page>
    );
}

export default Home;