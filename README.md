# Díla na maturitu

Tento projekt byl web, který obsahoval materiály na ústní maturitu z češtiny. Dnes už je mrtvý, ale můžete si jej v případě zájmu spustit u sebe nebo jej klidně někde deploynout. Je mi to úplně jedno, klidně si jej jakkoliv upravte. Všechny materiály, které na webu byly vytvořeny jsou archivovány __[zde](https://github.com/Jirkasa/dila-na-maturitu-archivovane-materialy)__.

Tento projekt jsem se rozhodl vytvořit, protože jsem se potřeboval naučit na ústní maturitu z češtiny. Nechtěl jsem se tyto zbytečné věci učit jen tak, proto mě napadlo vytvořit web, prostřednictvím kterého bych zároveň pomohl připravit se na ústní maturitu z češtiny i jiným lidem.

Server je naprogramovaný v NodeJS a frontend v Reactu.

---

## Struktura zdrojového kódu pro server

V kořenové složce jménem server se nacházejí následující složky:

| složka        | popis                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| src           | zdrojový kód pro server                                                                                      |
| public        | sestavený kód frontend aplikace - Gitem je ignorována, aby v repozitáři nezabíral místo                      |
| views         | složka se stránkou pro uložení access tokenu, refresh tokenu a uživatele do local storage po jeho přihlášení přes google |
| google-authentication-public | složka s CSS a JS souborem pro stránku ve složce views sloužící k přihlášení přes google      |

Zdrojový kód pro server ve složce src je strukturován v podstatě podle MVC architektury. Náchází se v ní následující složky a soubory:

| soubor/složka | popis                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| index.js      | tímto souborem se kód pro server spouští                                                       |
| app.js        | v tomto souboru je nakonfigurována Express aplikace, která je poté spuštěna v souboru index.js |
| helpers.js    | tento soubor obsahuje pár pomocných funkcí, které jsou používány v jiných místech kódu         |
| models        | tato složka obsahuje kód, týkající se tvorby Sequelize modelů pro databázi                     |
| routes        | tato složka obsahuje složky, které vždy obsahují router (definuje endpointy) a controller (kód pro endpointy) |
| services      | tato složka obsahuje služby jako je připojení k databázi nebo posílání emailů                  |
| middlewares   | tato složka obsahuje middlewary (například pro přístup k endpointům jen když je uživatel přihlášen, atd...) |

## Struktura zdrojového kódu pro frontend

Můj kód pro frontend není tak dobře zorganizovaný jako ten pro server, ale nějakou strukturu má. V kořenové složce se nachází tyto složky:

| složka        | popis                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| public        | obsahuje vstupní soubor index.html a assety, které se ve frontend aplikaci používají    |
| src           | zdrojový kód frontend aplikace                                                          |

Zdrojový kód frontend aplikace ve složce src je tříděn do následující složek a souborů:

| soubor/složka | popis                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------- |
| index.js      | tímto souborem se frontend aplikace spouští (vyrenderuje se komponenta jménem App, nacházející se v souboru app.js) |
| app.js        | hlavní komponenta aplikace (obsahuje definované cesty pro jednotlivé stránky aplikace pomocí React Router) |
| helpers.js    | tento soubor obsahuje pár pomocných funkcí, které jsou používány v jiných místech kódu        |
| config.js     | obsahuje pár věcí pro konfiguraci frontend aplikace                                           |
| pages         | tato složka obsahuje jednotlivé stránky aplikace                                              |
| components    | tato složka obsahuje komponenty, které jsou různě použity na stránkách (a v jiných komponentách) |
| contexts      | tato složka obsahuje contexty (obsahuje jen jeden kontext, který slouží k autentizaci)        |
| route-guards  | obsahuje komponenty, které mohou být použity k obalení stránek, například pro zamezení vstoupení na stránku bez přihlášení |

Vytvořením této frontend aplikace jsem se poučil v mnoha věcech. Budu si například pravděpodobně muset začít nějak více třídit komponenty, zlepšit jejich stylování (například pomocí __[Styled Components](https://styled-components.com/)__), nastavovat id a htmlFor atributy jinou cestou (to v této aplikaci obzvlášť nebylo vůbec ideální), a tak podobně.

## Spuštění aplikace lokálně

Pokud si chcete můj web spustit lokálně na svém počítači, tak můžete, ale je potřeba nastavit spoustu věcí. Pro začátek si budete muset naklonovat tento repozitář pomocí následujícího příkazu:

    git clone https://github.com/Jirkasa/dila-na-maturitu.git

Poté co si jej naklonujete se přepněte do nově vytvořené složky a napište příkaz, pomocí kterého nainstalujete balíčky pro frontend i backend:

    npm install

Až se vše nainstaluje, tak budete muset sestavit frontend aplikaci. Nejprve budete muset ve složce client editovat soubor .env.sample a přejmenovat jej na .env.local. Hodnota proměnné REACT_APP_API_URL by pro vývoj měla být nastavena na http://localhost:4000/v1, takže se ujistěte že to tak je. Poté můžete aplikaci sestavit pomocí následujícího příkazu:

    npm run build

Poté co se frontend aplikace sestaví, by v server složce měla vzniknout složka public. Odtud bude server frontend aplikaci servírovat.

Nakonec je potřeba nakonfigurovat backend. Ve složce server se nachází soubor .env.sample, který je potřeba editovat a přejmenovat na .env. Zde je popis proměnných, které se v tomto souboru nacházejí:

| proměnná        | popis                                                                              |
| --------------- | ---------------------------------------------------------------------------------- |
| PORT            | určuje na jakém portu má aplikace běžet                                            |
| DATABASE_NAME   | jméno databáze, kterou má aplikace používat                                        |
| DATABASE_USER   | jméno uživatele databáze, přes kterého se aplikace k databázi připojí              |
| DATABASE_PASSWORD | heslo k databázi                                                                 |
| DATABASE_HOST   | určuje kam se připojit k databázi                                                  |
| ACCESS_TOKEN_SECRET | tajná hodnota pro generování access tokenů                                     |
| REFRESH_TOKEN_SECRET | tajná hodnota pro generování refresh tokenů                                   |
| RESET_PASSWORD_TOKEN_SECRET | tajná hodnota pro generování tokenů pro reset hesla                    |
| GOOGLE_CLIENT_ID | Client ID pro přihlášení pres Google (toto nemusíte vyplňovat a prostě se přes Google nepřihlašovat) |
| GOOGLE_CLIENT_SECRET | tajná hodnota pro přihlášení přes Google (toto nemusíte vyplňovat a prostě se přes Google nepřihlašovat) |
| DEV_MODE        | určuje, jestli má aplikace běžet v módu pro vývoj                                  |
| USE_POSTGRESS   | určuje, jestli se má použít postgres namísto mysql                                 |
| SMTP_USER       | SMTP User pro zasílání emailů                                                      |
| SMTP_KEY        | SMTP Key pro zasílání emailů                                                       |
| SERVER_URL      | URL na kterém aplikace běží                                                        |

Poznámka: Zasílání emailů je řešeno přes Send In Blue, pokud budete chtít použít jinou službu, tak budete muset upravit ve složce services v souboru emailer.js Transporter.

Po nastavení všech požadovaných proměnných můžete aplikaci spustit pomocí následujícího příkazu:

    npm start

Pokud jste neměnili port, tak bude aplikace k dispozici na této adrese: __[http://localhost:4000](http://localhost:4000)__