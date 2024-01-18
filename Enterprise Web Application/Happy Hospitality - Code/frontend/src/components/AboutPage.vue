<!-- @author Mike Schaper -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";

export default {
    name: "AboutPage",
    created() {
        documentTitle("Over Ons");
    }
};
</script>

<template>
    <div class='content-wrapper indent'>
        <section class='top'>
            <div class='information-title-wrapper'>
                <h2 class='information-title'>Over ons</h2>
            </div>
            <article>
                <p>
                    Happy Hospitality is een collectief dat vanuit innovatie en
                    samenwerking de markt in beweging zet rondom duurzaamheid
                    binnen hospitality. We leggen de verbinding tussen
                    gebruikers en ketenpartners door innovatiehubs te initiëren
                    en vanuit daar te blijven innoveren voor een duurzame horeca
                    branche.
                </p>
            </article>
        </section>
        <section>
            <article>
                <h2 class='header'>Samen doen we onderzoek</h2>
                <p>
                    Onderzoek is een belangrijke pilaar van onze organisatie.
                    Enerzijds willen wij bestaand onderzoek makkelijk
                    toegankelijk maken voor de markt; er wordt immers al zo veel
                    onderzoek gedaan met veelbelovende resultaten, het is alleen
                    niet voor iedereen even makkelijk te vinden Daarnaast zullen
                    we ook zelf, met en vanuit het netwerk, aanvullend onderzoek
                    verzorgen rondom de 6 thema’s van onze duurzame focus.
                    <br/><br/>
                    Deze uitkomsten delen we met het netwerk, zodat iedereen
                    ervan kan leren. We zetten deze onderzoeken altijd op in
                    samenwerking met een kennisinstelling en haar studenten.
                    Onderstaand onderzoek is opgezet in samenwerking met de Hoge
                    Hotelschool in Den Haag. We hopen dat horecaondernemers even
                    de tijd nemen om ons van inzichten te voorzien.
                </p>
            </article>
        </section>
        <section class='grid'>
            <article class='flex'>
                <div>
                    <h2 class='header'>HOE WE WERKEN</h2>
                    <p>
                        Door mensen te verbinden en te laten ervaren wat er
                        mogelijk is verspreiden we kennis, innovatie en ...
                    </p>
                </div>
            </article>
            <div>
                <img
                    alt='Hoe werken we'
                    src='../assets/images/static/image5.png'
                />
            </div>
        </section>
        <section>
            <article>
                <h2 class='header'>OVER HAPPY HOSPITALITY</h2>
                <p>
                    We hebben allemaal de klok wel horen luiden; de een heeft
                    het over duurzaamheid, de ander over circulaire business
                    modellen of een eerlijke manier van werken. De krant staat
                    bol van nieuws over stikstof, uitstoot, co2 reductie sus en
                    minder vlees zo. Onze geneugten worden aan banden gelegd,
                    niet meer vliegen voor een weekendje, geen vlees meer, en nu
                    ook nog eens de kachel uit. En het erge is dat het allemaal
                    verband schijnt te hebben en we die verantwoordelijkheid
                    samen moeten pakken en dragen.
                    <br/>
                    <br/>
                    Maar waar begin je dan als horeca ondernemer? Wie spreek je
                    aan als je toeleverancier gewoonweg niet aan je duurzame
                    vraag kan voldoen en jij morgen wel weer aan je klant vraag
                    moet voldoen en er een volle menukaart aanwezig moet zijn?
                    Hoe spreek je die accountmanager aan op het assortiment als
                    je het gevoel hebt dat je alleen staat? En welke vragen moet
                    die accountmanager terugstellen om goed te begrijpen waar je
                    behoefte ligt op het gebied van duurzaamheid? Hoe kan je
                    samenwerken zodat het gewoon eerlijk, duurzaam en vooral
                    gezellig is in de horeca?
                    <br/>
                    <br/>
                    <strong>
                        We werken aan een collectief dat samenwerkt, denkt,
                        leert en uitvoert om onze geliefde horecabranche verder
                        te brengen in de duurzame transitie.
                    </strong>
                    <br/>
                    <br/>
                    Happy Hospitality is een initiatief van Karin Lindenhovius,
                    Ellekari Klaasse, Carlijn Wijnmalen-Groen en World Startup.
                    <br/>
                    <br/>
                    We pakken de meest actuele duurzame thema’s, de grootste
                    horeca problemen en gaan met elkaar werken aan constructieve
                    oplossingen en innovaties.
                    <br/>
                    <br/>
                    Dit doen we door het gesprek te faciliteren, een
                    grootschalig onderzoek uit te zetten in de markt, de
                    inzichten te vertalen naar concrete probleemstellingen, deze
                    met experts te analyseren door met verschillende
                    waardeproposities te komen, en deze vervolgens te testen in
                    de markt.
                    <br/>
                    <br/>
                    De inzichten en uitkomsten delen we met de markt, zodat
                    iedereen kan mee leren en profiteren en we samen werken aan
                    een gelukkige duurzame horeca markt.
                </p>
            </article>
        </section>
    </div>
</template>

<style scoped>
.content-wrapper {
    padding-top: 130px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid img {
    width: 100%;
}

.grid .flex {
    display: flex;
    align-items: center;
}

section {
    margin: 2.5rem 0;
}

section .header {
    margin-bottom: 1rem;
}

.top,
.bottom {
    display: flex;
    gap: 50px;
}

.information-title-wrapper {
    background-color: var(--accent-a);
    text-align: center;
    height: fit-content;
}

.information-title,
.filler {
    font-weight: 400;
    width: 150px;
    text-transform: uppercase;
}

.top article {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 70%;
}

.button:hover {
    text-decoration: underline;
}

@media (width <= 630px) {
    .top {
        flex-direction: column;
    }

    .filler {
        display: none;
    }

    .bottom {
        justify-content: center;
    }

    .content-wrapper {
        flex-direction: column;
        gap: 20px;
    }

    .information-title-wrapper {
        margin: auto;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 1rem;
    }

    article {
        text-align: center;
        width: 90%;
        margin: auto;
    }
}
</style>
