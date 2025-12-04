<script setup lang="ts">
import { type ChartOptions } from 'chart.js';
import type { ChartData } from '~/assets/customTypes';

// Props
defineProps({
    "goalData_0_1": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_2_1": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_2_2": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_2_3": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_3_1": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_3_2": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_4_1": { type: Array as PropType<Array<ChartData>>, required: true },
    "goalData_4_2": { type: Array as PropType<Array<ChartData>>, required: true }
});

// Methods

/**
 * Default options for the chart.
 * @param title The title of the graph.
 */
function getOptions(title: string, min: number, max: number, type: string = "line"): ChartOptions {
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title
            }
        },
        tension: 0.1,
        scales: null as any
    };

    const scaleDisabled = ["radar", "polarArea"];
    if (!scaleDisabled.includes(type)) {
        options["tension"] = 0.2;
        options["scales"] = {
            y: {
                min: min,
                max: max
            }
        };
    }
    return options;
}
</script>

<template>
    <section class="content-wrapper">
        <article class="flex-col">
            <p>
                Op deze pagina zijn verschillende grafieken te zien die mijn leerdoel inspanning en resultaten in kaart
                brengen. Ik begon met een simpele Excel, maar dat bleek toch wat minder overzichtelijk en presenteerbaar
                te zijn.
            </p>
            <p>
                Tijdens mijn stage houd ik deze meetpunten in een database actief bij, zodat hier altijd de nieuwste
                resultaten te zien zijn. Zie ook de <NuxtLink to="/table">Tabellen</NuxtLink> pagina voor nog meer
                interessante data.
            </p>
            <p>
                Om het systeem te besparen worden sommige datasets in de browser (session storage) opgeslagen. Dit
                betekent dat de data niet opnieuw opgehaald hoeft te worden bij het herladen van de pagina. Mocht u de
                nieuwste data willen hebben, klik dan rechtsboven op de refresh knop.
            </p>
        </article>
        <span class="splitter"></span>
        <h2>Ticket Kwantiteit</h2>
        <article class="flex-col">
            <p>
                Voordat ik de leerdoelen behandel, heb ik hieronder eerst een staafgrafiek gemaakt die het aantal
                tickets per week laat zien. Dit is ook een handig gegeven, want de andere grafieken zijn allemaal
                gemiddelden.
            </p>
        </article>
        <ClientOnly>
            <ChartBar class="chart" label="Aantal tickets per week" v-if="goalData_0_1" :data="goalData_0_1"
                :options="getOptions('Aantal tickets per week', 0, 14)">
            </ChartBar>
        </ClientOnly>
        <span class="splitter"></span>
        <h2>Leerdoel 2: Samenwerken</h2>
        <article class="flex-col">
            <p>
                Voor dit leerdoel heb ik verschillende data bijgehouden gedurende mijn stage. Ik presenteer deze data
                door middel van de onderstaande grafieken die een goed beeld geven van mijn inspanning en resultaten.
                De grafieken werken met een precisie van een week, en zijn dus gemiddelden per week. Het doel is om door
                meer vragen te stellen efficiënter te werken en de kwaliteit van mijn werk te verhogen. Minder tijd
                besteed en minder QA iteraties voordat de ticket echt af is en productie in kan.
            </p>
            <span class="splitter splitter-light"></span>
            <p>
                Hieronder is een grafiek te zien van hoeveel tijd in procenten ik besteed heb aan alle taken per week.
                Stel een ticket is begroot ter waarde van 90 minuten en ik besteed omdat ik vlijtig ben maar 60 minuten,
                dan is het percentage 66%. 150% van 90 minuten zou dus 135 besteedde minuten betekenen. In realiteit zit
                ik hier vaker boven dan onder. De begroting is een inschatting gemaakt door en voor ervaren
                collega's, dus daarom zit ik er meestal ietwat boven. Dit is uiteraard te verwachten en geen probleem.
            </p>
        </article>
        <ClientOnly>
            <ChartLine class="chart" label="Besteedde en geplande tijd per ticket in procenten per week."
                v-if="goalData_2_1" :data="goalData_2_1"
                :options="getOptions('Tijd besteed per taak gemiddeld per week in procenten', 0, 200)">
            </ChartLine>
        </ClientOnly>
        <small class="graph-note">Lager is beter.</small>
        <span class="splitter splitter-light"></span>
        <article class="flex-col">
            <p>
                Hieronder is een grafiek te zien van hoeveel QA iteraties er nodig waren voordat een taak productie in
                kon. Dit is een indicator van hoe goed ik de taak begreep en hoe goed ik de taak heb uitgevoerd. Maar
                het gaat natuurlijk ook om programmeerkennis. Er zijn in het framework bijvoorbeeld veel ingebouwde
                functies die ik gebruiken kan,en zo hoef ik zelf het wiel niet opnieuw uit te vinden. Dit moet je maar
                net weten uiteraard, dus bij de QA leer ik ook veel. Hier maakt mijn collega me dan op attent. Een
                waarde van 0 betekent dat er wel naar gekeken is, maar dat er geen verdere aanpassingen nodig waren.
                Sommige taken zijn gevoelig en complex, dus vereisen daarom veel iteraties. Over het algemeen is dit
                getal naar beneden te krijgen door vragen te stellen, wat het doel van dit leerdoel is.
            </p>
        </article>
        <ClientOnly>
            <ChartLine class="chart"
                label="Hoeveelheid QA iteraties vereist voordat een taak productie in kon per week." v-if="goalData_2_2"
                :data="goalData_2_2" :options="getOptions('QA iteraties vereist per taak gemiddeld per week', -0.5, 2)">
            </ChartLine>
        </ClientOnly>
        <small class="graph-note">Lager is beter.</small>
        <span class="splitter splitter-light"></span>
        <article class="flex-col">
            <p>
                De laatste grafiek van dit leerdoel laat zien hoeveel vragen ik gesteld heb per taak per week. Hoewel
                dit niet gelijk een indicator is van hoe goed ik de taak begreep, is het wel te vergelijken met de
                andere grafieken. Als deze omhoog gaat, dan zouden de andere omlaag moeten gaan.
            </p>
        </article>
        <ClientOnly>
            <ChartLine class="chart" label="Hoeveelheid vragen gesteld gemiddeld per taak per week." v-if="goalData_2_3"
                :data="goalData_2_3" :options="getOptions('Vragen gesteld per taak gemiddeld per week', -0.5, 4)">
            </ChartLine>
        </ClientOnly>
        <span class="splitter"></span>
        <h2>Leerdoel 3: Organisatorische Context</h2>
        <article class="flex-col">
            <p>
                Dan door naar het derde leerdoel. Dit leerdoel is bedoeld om te leren hoe ik mijn werkzaamheden beter
                binnen de lijnen uit te voeren, en het toevoegen van extra's goed te communiceren, documenteren en
                testen. Het leerdoel ontstond toen ik de hoofdfunctionaliteit van de ticket per ongeluk brak doordat
                mijn extra functionaliteit geen rekening hield met een ongeteste edge case. Dit is natuurlijk niet de
                bedoeling, en daarom is dit leerdoel ontstaan. Ik ben gewend om zelf te bouwen wat ik wil, waar de
                consequenties aanzienlijk lager zijn dan dat bij mijn stagebedrijf.
            </p>
            <p>
                Ik raak snel enthousiast en naarmate ik kundiger word sneller geneigd om extra functionaliteit toe te
                voegen die opzich leuk gevonden zijn, maar dan ook wel goed getest moeten worden. Dit is een valkuil die
                ik moet vermijden.
            </p>
            <span class="splitter splitter-light"></span>
            <p>
                De eerste grafiek laat twee datasets zien. De eerste dataset gaat concreet over hoeveel extra
                functionaliteiten ik gemiddeld die week toegevoegd heb. De tweede dataset laat zien hoeveel incidenten
                er gemiddeld die week waren. Incidenten zijn problemen die ontstaan zijn in mijn gebouwde algemene
                functionaliteit. Het is dus niet direct aan elkaar verbonden, maar als de lijnen elkaar volgen laat het
                toch zien dat er een verband is. Het aantal extra's mag gerust erg hoog zijn, zo lang de incidenten maar
                laag blijven.
            </p>
        </article>
        <ClientOnly>
            <ChartLine class="chart" label="Hoeveelheid incidenten en extra functies per taak gemiddeld per week."
                v-if="goalData_3_1" :data="goalData_3_1"
                :options="getOptions('Aantal incidenten en extra functies per taak gemiddeld per week', -0.2, 2.5)">
            </ChartLine>
        </ClientOnly>
        <small class="graph-note">Minder incidenten is beter.</small>
        <span class="splitter splitter-light"></span>
        <article class="flex-col">
            <p>
                Deze grafiek is niet direct verbonden aan het leerdoel, maar laat ik zien om meer context aan
                incidenten te geven. Complexere taken (die daarmee hoger begroot zijn) hebben in mijn geval vaker
                incidenten. Dit is logisch, omdat er meer functionaliteit is die kapot kan gaan. In verband met de
                andere schaal en het niet willen verstoren van de andere grafiek, heb ik deze apart gezet. Als het
                aantal incidenten telkens een piek heeft wanneer deze grafiek ook een piek heeft, dan kan ervan uit
                gegaan worden dat dat met elkaar te maken heeft. Zo ligt het niet gelijk aan de extra functionaliteiten.
            </p>
            <p>
                Ik laat ook zien hoeveel tijd ik gemiddeld per taak besteed heb. Deze twee lijnen zouden ongeveer aan
                elkaar gelijk moeten zijn. Hier gaat leerdoel 2 meer over, dit is zoals eerder genoemd voor meer
                context.
            </p>
        </article>
        <ClientOnly>
            <ChartLine class="chart" label="Geplande tijd per taak gemiddeld per week in uren." v-if="goalData_3_2"
                :data="goalData_3_2" :options="getOptions('Geplande tijd per taak gemiddeld per week in uren', 0, 40)">
            </ChartLine>
        </ClientOnly>
        <small class="graph-note">Minder tijd besteed is beter.</small>
        <span class="splitter"></span>
        <h2>Leerdoel 4: Persoonlijke Ontwikkeling</h2>
        <article class="flex-col">
            <p>
                Ook voor dit leerdoel heb ik verschillende data bijgehouden gedurende mijn stage. Bij mijn PO leerdoel
                gaat het erom dat ik in meer 'afdelingen' van het bedrijf meedraai, en zo meer kennis opdoe. Dit
                betekent dus niet alleen backend, maar ook deployment, frontend, enzovoorts. Bij verschillende
                afdelingen horen dan natuurlijk ook andere talen, dus die heb ik ook bijgehouden. Omdat ik nog in
                opleiding ben is het te vroeg om me te specialiseren, en daarom is het belangrijk dat ik breed inzetbaar
                ben.
            </p>
            <p>
                Ik laat dit leerdoel zien door gebruik te maken van een Radar chart. Dit type grafiek geeft goed aan hoe
                verdeeld mijn werkzaamheden zijn. Des te meer verdeeld, des te beter. Het eerste paar grafieken tellen
                de hoeveelheid dat een categorie of taal in een taak voorkomt, en het tweede paar gebruikt de besteedde
                tijd in uren. Ze lijken op elkaar, maar het is toch interessant om de verschillen te vergelijken.
            </p>
            <span class="splitter splitter-light"></span>
            <p>
                Per grafiek heb ik drie datasets: de eerste neemt de data van de gehele stageperiode, de tweede van
                enkel de eerste helft, en de derde van alleen de tweede helft. Door de totale dataset uit te schakelen
                (klik op het corresponderende label boven de grafiek) is het verschil te zien tussen de eerste en
                tweede helft.
            </p>
        </article>
        <ClientOnly>
            <div class="radar-chart-wrapper">
                <ChartRadar v-if="goalData_4_1 && goalData_4_1.length > 0" class="chart"
                    label="Werkzaamheden per categorie in aantal" :data="goalData_4_1[0]"
                    :options="getOptions('Werkzaamheden per categorie in aantal', 0, 0, 'radar')"></ChartRadar>
                <ChartRadar v-if="goalData_4_1 && goalData_4_1.length > 1" class="chart"
                    label="Werkzaamheden per taal in aantal" :data="goalData_4_1[1]"
                    :options="getOptions('Werkzaamheden per taal in aantal', 0, 0, 'radar')"></ChartRadar>
            </div>
            <div class="radar-chart-wrapper">
                <ChartRadar v-if="goalData_4_2 && goalData_4_2.length > 0" class="chart"
                    label="Werkzaamheden per categorie in uren" :data="goalData_4_2[0]"
                    :options="getOptions('Werkzaamheden per categorie in uren', 0, 0, 'radar')"></ChartRadar>
                <ChartRadar v-if="goalData_4_2 && goalData_4_2.length > 1" class="chart"
                    label="Werkzaamheden per taal in uren" :data="goalData_4_2[1]"
                    :options="getOptions('Werkzaamheden per taal in uren', 0, 0, 'radar')"></ChartRadar>
            </div>
        </ClientOnly>
        <small class="graph-note">Gelijkmatige verdeeldheid is beter.</small>
        <span class="splitter"></span>
    </section>
</template>

<style scoped>
.chart {
    height: 400px;
}

.radar-chart-wrapper {
    width: 400px;
    display: flex;
}

.graph-note {
    width: 100%;
    text-align: center;
}

@media (width <=820px) {
    .radar-chart-wrapper {
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
}
</style>
