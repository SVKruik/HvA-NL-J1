<script setup lang="ts">
import { TableHeaderType, type ChartData, type LearningGoal_Generic_Datasets, type LearningGoalEntry, type TableAllData, type TableDataLearningGoal_Generic, type TableDataLearningGoal_4_Item, type TableDataLearningGoal_3_Item, type GenericRowItem, type TableHeaderGenericItem } from '~/assets/customTypes';
import { table_2_Parser, table_4_Parser } from '~/utils/data';
import { formatISODate } from '~/utils/date';

// Reactive Data
const tableAllData: Ref<TableAllData> = ref({ tableHeaders: [], points: [] });
const tableGoalData_2_1: Ref<TableDataLearningGoal_Generic | null> = ref(null);
const tableGoalData_2_2: Ref<TableDataLearningGoal_Generic | null> = ref(null);
const tableGoalData_2_3: Ref<TableDataLearningGoal_Generic | null> = ref(null);
const tableGoalData_3_1: Ref<TableDataLearningGoal_3_Item | null> = ref(null);
const tableGoalData_3_2: Ref<TableDataLearningGoal_3_Item | null> = ref(null);
const tableGoalData_4: Ref<Array<TableDataLearningGoal_4_Item> | null> = ref(null);
const tableGoalDataRefs: Record<string, Ref<TableDataLearningGoal_Generic | TableDataLearningGoal_3_Item | Array<TableDataLearningGoal_4_Item> | null>> = {
    "goalData_2_1": tableGoalData_2_1,
    "goalData_2_2": tableGoalData_2_2,
    "goalData_2_3": tableGoalData_2_3,
    "goalData_3_1": tableGoalData_3_1,
    "goalData_3_2": tableGoalData_3_2,
    "goalData_4": tableGoalData_4
};

// Props
const props = defineProps({
    "goalData_2_1": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_2_2": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_2_3": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_3_1": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_3_2": { type: [Object, null] as PropType<ChartData | null>, required: true },
    "goalData_4_1": { type: Array as PropType<Array<ChartData>>, required: true },
    "goalData_4_2": { type: Array as PropType<Array<ChartData>>, required: true },
});

// Data Fetch
onMounted(async () => {
    tableAllData.value = await $fetch("/api/table");
    tableGoalData_2_1.value = table_2_Parser(props.goalData_2_1 as ChartData, TableHeaderType.PERCENTAGE);
    tableGoalData_2_2.value = table_2_Parser(props.goalData_2_2 as ChartData, TableHeaderType.NUMBER);
    tableGoalData_2_3.value = table_2_Parser(props.goalData_2_3 as ChartData, TableHeaderType.NUMBER);
    tableGoalData_3_1.value = table_3_Parser(props.goalData_3_1 as ChartData);
    tableGoalData_3_2.value = table_3_Parser(props.goalData_3_2 as ChartData);
    tableGoalData_4.value = table_4_Parser(props.goalData_4_1.concat(props.goalData_4_2) as Array<ChartData>, TableHeaderType.NUMBER);
});

// Methods

/**
 * Render special cells for the main table.
 * @param key The key of the row.
 * @param value The value of the to be placed cell.
 */
function cellRenderer(key: keyof LearningGoalEntry, value: string | number): string | number {
    switch (key) {
        case "timeTakenPercentage":
            return `${value}%`;
        case "type":
            return value === "development" ? "Dev" : "QA";
        case "weekNumber":
            return (value as number) < 2500 ? (value as number) - 2400 : (value as number) - 2500;
        default:
            return value;
    }
}

/**
 * Sort the All Data table based on the clicked column.
 * @param event The click event.
 * @param column The column to sort on.
 * @param type Overwrite the default sorting method. Default is number.
 */
function sortTableAll(event: MouseEvent, column: keyof LearningGoalEntry, type?: TableHeaderType): void {
    const eventTarget: HTMLTableCellElement = event.target as HTMLTableCellElement;
    const sortOrder: string = eventTarget.getAttribute("data-sort-order") as string;
    const multiplier: number = sortOrder === "asc" ? 1 : -1;
    eventTarget.setAttribute("data-sort-order", sortOrder === "asc" ? "desc" : "asc");

    if (type === TableHeaderType.NUMBER || type === TableHeaderType.PERCENTAGE) {
        tableAllData.value.points.sort((a, b) => {
            const columnA: number = parseInt(a[column] as string);
            const columnB: number = parseInt(b[column] as string);

            if (columnA < columnB) return -1 * multiplier;
            if (columnA > columnB) return 1 * multiplier;
            return 0;
        });
    } else if (type === TableHeaderType.DATE) {
        tableAllData.value.points.sort((a, b) => {
            const columnA: Date = new Date(formatISODate(a[column] as string));
            const columnB: Date = new Date(formatISODate(b[column] as string));

            if (columnA < columnB) return -1 * multiplier;
            if (columnA > columnB) return 1 * multiplier;
            return 0;
        });
    } else tableAllData.value.points.sort((a, b) => {
        if (a[column] < b[column]) return -1 * multiplier;
        if (a[column] > b[column]) return 1 * multiplier;
        return 0;
    });
}

/**
 * Sort a non-specific single type table based on the clicked column.
 * @param event The click event.
 * @param column The column to sort on.
 * @param data The dataset to use for sorting.
 */
function sortTableGenericSingle(event: MouseEvent, column: keyof TableDataLearningGoal_Generic["points"][0], data: keyof LearningGoal_Generic_Datasets) {
    const datasets = tableGoalDataRefs[data].value as TableDataLearningGoal_Generic;
    if (!datasets) return;

    const eventTarget: HTMLTableCellElement = event.target as HTMLTableCellElement;
    const sortOrder: string = eventTarget.getAttribute("data-sort-order") as string;
    const multiplier: number = sortOrder === "asc" ? 1 : -1;
    eventTarget.setAttribute("data-sort-order", sortOrder === "asc" ? "desc" : "asc");

    datasets.points.sort((a, b) => {
        let columnA: number = a[column];
        let columnB: number = b[column];
        if (column === "week") {
            columnA < 37 ? columnA += 2500 : columnA += 2400;
            columnB < 37 ? columnB += 2500 : columnB += 2400;
        }

        if (columnA < columnB) return -1 * multiplier;
        if (columnA > columnB) return 1 * multiplier;
        return 0;
    });
}

/**
 * Sort a non-specific multiple type table based on the clicked column.
 * @param event The click event.
 * @param column The column to sort on.
 * @param data The dataset to use for sorting.
 */
function sortTableGenericMultiple(event: MouseEvent, column: string, data: keyof LearningGoal_Generic_Datasets | Array<TableHeaderGenericItem>, points: Array<GenericRowItem> | Array<number>): void {
    if (typeof data === "string" && ["goalData_2_1", "goalData_2_2", "goalData_2_3"].includes(data)) return;

    const eventTarget: HTMLTableCellElement = event.target as HTMLTableCellElement;
    const sortOrder: string = eventTarget.getAttribute("data-sort-order") as string;
    const multiplier: number = sortOrder === "asc" ? 1 : -1;
    eventTarget.setAttribute("data-sort-order", sortOrder === "asc" ? "desc" : "asc");

    if (typeof data === "string") {
        // 3
        const processedPoints = points as Array<GenericRowItem>;
        processedPoints.sort((a, b) => {
            let columnA: number = a[column as keyof TableDataLearningGoal_3_Item["setA"][0]];
            let columnB: number = b[column as keyof TableDataLearningGoal_3_Item["setA"][0]];
            if (column === "week") {
                columnA < 37 ? columnA += 2500 : columnA += 2400;
                columnB < 37 ? columnB += 2500 : columnB += 2400;
            }

            if (columnA < columnB) return -1 * multiplier;
            if (columnA > columnB) return 1 * multiplier;
            return 0;
        });
    } else if (typeof data === "object") {
        // 4
        const index = data.findIndex((header) => header.label === column);
        const processedPoints = points as Array<any>;
        processedPoints.sort((a, b) => {
            const columnA: number = a[index];
            const columnB: number = b[index];

            if (columnA < columnB) return -1 * multiplier;
            if (columnA > columnB) return 1 * multiplier;
            return 0;
        });
    }
}

/**
 * Render special cells for the goal data tables.
 * @param key The key of the row.
 * @param value The value of the to be placed cell.
 * @param invert Invert the colors of the trend arrows.
 */
function tableGoalData_Generic_Viewer(key: keyof TableDataLearningGoal_Generic["points"][0], value: string | number, invert: boolean, type: TableHeaderType, previousValue: number | undefined): number | string {
    const trendValues = getTrendColors(invert);

    if (key === "delta") {
        return `
            <div class="flex ${!previousValue ? 'hidden' : ''}">
                <p class="${value === 0 ? 'hidden' : ''}
                    text-color-${(value as number) > 0 ? trendValues.colorBad : trendValues.colorGood}">${value}</p>

                <p class="${value === 0 ? '' : 'hidden'}
                    text-color-blue">${value}</p>

                <i class="fa-regular
                    ${value === 0 ? 'hidden' : ''}
                    fa-arrow-trend-${(value as number) > 0 ? 'up' : 'down'}
                    text-color-${(value as number) > 0 ? trendValues.colorBad : trendValues.colorGood}"></i>
                <i class="fa-regular fa-arrow-right-long text-color-blue
                    ${value === 0 ? '' : 'hidden'}"></i>
            </div>`;
    } else if (type === "percentage") {
        return `${value}%`;
    } else return value;
}

/**
 * Get the colors for the trend arrows. Depending on use case, downward trend is good or bad.
 * @param invert Whether to invert the colors. Default is false, so green is good and red is bad.
 */
function getTrendColors(invert: boolean): { colorGood: "red" | "green", colorBad: "red" | "green" } {
    return invert ? {
        "colorGood": "red",
        "colorBad": "green"
    } : {
        "colorGood": "green",
        "colorBad": "red"
    }
}
</script>

<template>
    <section class="content-wrapper">
        <article class="flex-col">
            <p>
                Op deze pagina zijn de <NuxtLink to="/graph">grafieken</NuxtLink> in tabelvorm te vinden. Daarnaast is
                er ook een tabel die alle meetpunten laat zien.
            </p>
            <p>
                Tijdens mijn stage houd ik deze meetpunten in een database actief bij, zodat hier altijd de nieuwste
                resultaten te zien zijn. Zie ook de <NuxtLink to="/graph">Grafieken</NuxtLink> pagina voor nog meer
                interessante data.
            </p>
            <p>
                Om het systeem te besparen worden sommige datasets in de browser (session storage) opgeslagen. Dit
                betekent dat de data niet opnieuw opgehaald hoeft te worden bij het herladen van de pagina. Mocht u de
                nieuwste data willen hebben, klik dan rechtsboven op de refresh knop.
            </p>
            <span class="splitter splitter-light"></span>
            <p>
                Alle tabellen ondersteunen sorteren op kolom. Klik op de kolomnaam/header om te sorteren. Sommige
                tabellen zijn te breed voor de pagina, dus deze zijn horizontaal scrollbaar. Gebruik de scrollbar onder
                de tabel of houd de Shift toets ingedrukt en scroll met de muis/trackpad.
            </p>
            <p>
                De kolom 'Verschil' laat het verschil zien tussen deze en vorige week. Per tabel kan een positief getal
                goed of juist slecht zijn (en andersom), dus ik heb dit met kleuren aangegeven.
            </p>
        </article>
        <span class="splitter"></span>
        <article class="flex-col">
            <p>
                Hieronder zijn de kolommen voor het tabel dat volgt nog even expliciet uitgelegd.
            </p>
        </article>
        <table class="information-table">
            <thead>
                <tr>
                    <th>Kolom</th>
                    <th>Uitleg</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Week Nr</td>
                    <td>Het weeknummer waarin aan het ticket begonnen is.</td>
                </tr>
                <tr>
                    <td>Ticket Nr</td>
                    <td>Het interne ticketnummer van het meetpunt.</td>
                </tr>
                <tr>
                    <td>T Geplanned</td>
                    <td>De geplande tijd voor de ticket in minuten. We doen sprint poker om de tijd te schatten, dus
                        deze waarde correspondeert met een gewicht.</td>
                </tr>
                <tr>
                    <td>T Nodig</td>
                    <td>De tijd die nodig was om de ticket af te ronden in minuten.</td>
                </tr>
                <tr>
                    <td>T Nodig %</td>
                    <td>Het percentage van de geplande tijd dat nodig was om de ticket af te ronden. 100% betekent
                        dat de ticket precies op tijd was afgerond. Onder de 100% betekent dat de ticket sneller was
                        afgerond dan gepland en boven de 100% betekent dat de ticket langer duurde dan gepland.</td>
                </tr>
                <tr>
                    <td>Vragen</td>
                    <td>Hoeveel keer hulp ik nodig had om de ticket af te ronden.</td>
                </tr>
                <tr>
                    <td>QA</td>
                    <td>Het aantal QA iteraties dat nodig was om de ticket af te ronden. Een lege waarde betekent
                        dat ik nog wacht op feedback van de QA. Een waarde van 0 betekent dat de ticket in één keer
                        goed was.</td>
                </tr>
                <tr>
                    <td>Incidenten</td>
                    <td>Het aantal incidenten die ontstaan zijn tijdens het bouwen van of na de ticket.</td>
                </tr>
                <tr>
                    <td>Extra's</td>
                    <td>Het aantal extra's dat ik toegevoegd heb aan de ticket.</td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>Wat voor type werkzaamheden ik verricht heb voor de ticket. Dit kan normale development of QA
                        zijn.</td>
                </tr>
                <tr>
                    <td>Categorie</td>
                    <td>Wat voor soort werkzaamheden ik verricht heb voor de ticket.</td>
                </tr>
                <tr>
                    <td>Taal</td>
                    <td>Welke programmeertalen ik gebruikt heb voor de ticket.</td>
                </tr>
                <tr>
                    <td>Datum Creatie</td>
                    <td>De datum waarop het meetpunt is aangemaakt. Dit hoeft niet op de dag van start of afronding
                        geweest te zijn. Soms krijg ik in batch nieuwe taken, en dan registreer ik deze alvast.</td>
                </tr>
                <tr>
                    <td>Datum Update</td>
                    <td>De datum waarop het meetpunt voor het laatst is bewerkt. Een ticket kan geüpdatet worden doordat
                        ik een incident toevoeg, een extra vraag stel, of de ticket afrond (en dan de QA-iteraties
                        aanpas).
                    </td>
                </tr>
            </tbody>
        </table>
        <span class="splitter"></span>
        <h2>Alle Meetpunten</h2>
        <article class="flex-col">
            <p>
                Voordat ik de datasets verwerkt laat zien, hierbij eerst de ruwe data die ik in de database heb
                opgeslagen. Het is gesorteerd op oplopend week nummer. Ik heb verder geen andere tabellen, dus uit deze
                data worden alle grafieken en berekeningen gemaakt. Ik heb zelf nog het tijds-percentage toegevoegd.
            </p>
            <p>
                Omdat het tabel zo groot is doordat het alle meetpunten laat zien, is het zowel horizontaal als
                verticaal scrollbaar.
            </p>
        </article>
        <span class="splitter splitter-light"></span>
        <strong>Alle Meetpunten ({{ tableAllData.points.length }})</strong>
        <div class="flex-col table-container table-1-container">
            <table class="table-1">
                <thead>
                    <tr>
                        <th data-sort-order="asc" v-for="header in tableAllData.tableHeaders" :key="header.id"
                            @click="sortTableAll($event, header.value, header.type)">{{ header.label }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(point, index) in tableAllData.points" :key="index">
                        <td v-for="(value, key) in point" :key="key">{{ cellRenderer(key, value) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <span class="splitter"></span>
        <h2>Leerdoel 2: Samenwerken</h2>
        <div class="table-container-multiple">
            <div class="flex-col table-container">
                <strong>Besteedde Tijd ({{ tableGoalData_2_1 ? tableGoalData_2_1.points.length : 0 }})</strong>
                <table class="table-2">
                    <thead>
                        <tr>
                            <th data-sort-order="asc" v-if="tableGoalData_2_1"
                                v-for="(header, index) in tableGoalData_2_1.tableHeaders" :key="index"
                                @click="sortTableGenericSingle($event, header.key, 'goalData_2_1')">{{ header.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tableGoalData_2_1" v-for="(point, superIndex) in tableGoalData_2_1.points"
                            :key="superIndex">
                            <td v-for="(value, key, index) in point" :key="key"
                                v-html="tableGoalData_Generic_Viewer(key, value, false, tableGoalData_2_1.tableHeaders[index].type, Object.values(tableGoalData_2_1.points)[superIndex - 1]?.value)">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <small>Lager is beter.</small>
            </div>
            <div class="flex-col table-container">
                <strong>QA Iteraties ({{ tableGoalData_2_2 ? tableGoalData_2_2.points.length : 0 }})</strong>
                <table class="table-3">
                    <thead>
                        <tr>
                            <th data-sort-order="asc" v-if="tableGoalData_2_2"
                                v-for="(header, index) in tableGoalData_2_2.tableHeaders" :key="index"
                                @click="sortTableGenericSingle($event, header.key, 'goalData_2_2')">{{ header.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tableGoalData_2_2" v-for="(point, superIndex) in tableGoalData_2_2.points"
                            :key="superIndex">
                            <td v-for="(value, key, index) in point" :key="key"
                                v-html="tableGoalData_Generic_Viewer(key, value, false, tableGoalData_2_2.tableHeaders[index].type, Object.values(tableGoalData_2_2.points)[superIndex - 1]?.value)">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <small>Lager is beter.</small>
            </div>
            <div class="flex-col table-container">
                <strong>Vragen ({{ tableGoalData_2_3 ? tableGoalData_2_3.points.length : 0 }})</strong>
                <table class="table-4">
                    <thead>
                        <tr>
                            <th data-sort-order="asc" v-if="tableGoalData_2_3"
                                v-for="(header, index) in tableGoalData_2_3.tableHeaders" :key="index"
                                @click="sortTableGenericSingle($event, header.key, 'goalData_2_3')">{{ header.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tableGoalData_2_3" v-for="(point, superIndex) in tableGoalData_2_3.points"
                            :key="superIndex">
                            <td v-for="(value, key, index) in point" :key="key"
                                v-html="tableGoalData_Generic_Viewer(key, value, true, tableGoalData_2_3.tableHeaders[index].type, Object.values(tableGoalData_2_3.points)[superIndex - 1]?.value)">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <span class="splitter"></span>
        <h2>Leerdoel 3: Organisatorische Context</h2>
        <div class="table-container-duo">
            <div class="flex-col table-container">
                <strong>Extra's ({{ tableGoalData_3_1 ? tableGoalData_3_1.setA.length : 0 }})</strong>
                <table class="table-1">
                    <thead>
                        <tr>
                            <th data-sort-order="asc" v-if="tableGoalData_3_1"
                                v-for="(header, index) in tableGoalData_3_1.tableHeaders" :key="index"
                                @click="sortTableGenericMultiple($event, header.key, 'goalData_3_1', tableGoalData_3_1.setA)">
                                {{ header.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tableGoalData_3_1" v-for="(point, superIndex) in tableGoalData_3_1.setA"
                            :key="superIndex">
                            <td v-for="(value, key, index) in point" :key="key"
                                v-html="tableGoalData_Generic_Viewer(key, value, true, tableGoalData_3_1.tableHeaders[index].type, Object.values(tableGoalData_3_1.setA)[superIndex - 1]?.value)">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex-col table-container">
                <strong>Incidenten ({{ tableGoalData_3_1 ? tableGoalData_3_1.setB.length : 0 }})</strong>
                <table class="table-2">
                    <thead>
                        <tr>
                            <th data-sort-order="asc" v-if="tableGoalData_3_1"
                                v-for="(header, index) in tableGoalData_3_1.tableHeaders" :key="index"
                                @click="sortTableGenericMultiple($event, header.key, 'goalData_3_1', tableGoalData_3_1.setB)">
                                {{
                                    header.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tableGoalData_3_1" v-for="(point, superIndex) in tableGoalData_3_1.setB"
                            :key="superIndex">
                            <td v-for="(value, key, index) in point" :key="key"
                                v-html="tableGoalData_Generic_Viewer(key, value, false, tableGoalData_3_1.tableHeaders[index].type, Object.values(tableGoalData_3_1.setB)[superIndex - 1]?.value)">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <small>Lager is beter.</small>
            </div>
            <div class="flex-col table-container">
                <strong>Tijd Geplanned ({{ tableGoalData_3_2 ? tableGoalData_3_2.setA.length : 0 }})</strong>
                <table class="table-3">
                    <thead>
                        <tr>
                            <th data-sort-order="asc" v-if="tableGoalData_3_2"
                                v-for="(header, index) in tableGoalData_3_2.tableHeaders" :key="index"
                                @click="sortTableGenericMultiple($event, header.key, 'goalData_3_2', tableGoalData_3_2.setA)">
                                {{
                                    header.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tableGoalData_3_2" v-for="(point, superIndex) in tableGoalData_3_2.setA"
                            :key="superIndex">
                            <td v-for="(value, key, index) in point" :key="key"
                                v-html="tableGoalData_Generic_Viewer(key, value, true, tableGoalData_3_2.tableHeaders[index].type, Object.values(tableGoalData_3_2.setB)[superIndex - 1]?.value)">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex-col table-container">
                <strong>Tijd Besteed ({{ tableGoalData_3_2 ? tableGoalData_3_2.setB.length : 0 }})</strong>
                <table class="table-4">
                    <thead>
                        <tr>
                            <th data-sort-order="asc" v-if="tableGoalData_3_2"
                                v-for="(header, index) in tableGoalData_3_2.tableHeaders" :key="index"
                                @click="sortTableGenericMultiple($event, header.key, 'goalData_3_2', tableGoalData_3_2.setB)">
                                {{
                                    header.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="tableGoalData_3_2" v-for="(point, superIndex) in tableGoalData_3_2.setB"
                            :key="superIndex">
                            <td v-for="(value, key, index) in point" :key="key"
                                v-html="tableGoalData_Generic_Viewer(key, value, true, tableGoalData_3_2.tableHeaders[index].type, Object.values(tableGoalData_3_2.setB)[superIndex - 1]?.value)">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <span class="splitter"></span>
        <h2>Leerdoel 4: Persoonlijke Ontwikkeling</h2>
        <article class="flex-col">
            <p>
                Hieronder zijn de tabellen te vinden die op de <NuxtLink to="/graph">Grafieken</NuxtLink> pagina
                in radar grafiek-vorm te vinden zijn. In aantal betekent hoe vaak een categorie/taal bij een ticket
                betrokken was. In tijd betekent hoeveel tijd ik aan een categorie/taal heb besteed (doordat deze
                betrokken was bij een ticket). Net als bij de radar grafieken zijn de waardes ook opgesplitst in
                stage periodes.
            </p>
        </article>
        <span class="splitter splitter-light"></span>
        <div class="flex-col table-container-full-width" v-if="tableGoalData_4"
            v-for="(table, superIndex) in tableGoalData_4">
            <strong>{{ table.label }}</strong>
            <table :class="`table-${superIndex + 1}`">
                <thead>
                    <tr>
                        <th data-sort-order="asc" v-for="(header, index) in table.tableHeaders" :key="index"
                            @click="sortTableGenericMultiple($event, header.label, table.tableHeaders, table.points)">
                            {{ header.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(point, parentIndex) in table.points" :key="parentIndex">
                        <td v-for="(_header, index) in table.tableHeaders">{{ point[index] || "-" }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped>
.table-container-multiple {
    display: flex;
    gap: 20px;
}

.table-container-duo table,
.table-container-multiple table,
.table-container-multiple .table-container {
    width: 100%;
}

.table-container-duo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.table-container-full-width table {
    width: 100%;
}

.table-container-full-width th,
.table-container-full-width td {
    width: 150px;
}

.table-container-full-width,
.table-container {
    overflow-x: auto;
}

table {
    width: max-content;
    border-collapse: collapse;
}

.table-1-container {
    max-height: 600px;
    overflow-y: scroll;
}

.table-1 th {
    background-color: #6EC20770;
}

.table-2 th {
    background-color: #EF5A6F70;
}

.table-3 th {
    background-color: #3572EF70;
}

.table-4 th {
    background-color: #FF822570;
}

th:hover {
    filter: brightness(0.8);
}

th {
    cursor: pointer;
    user-select: none;
}

td:hover {
    background-color: var(--fill-light);
}

th,
td {
    border: 1px solid var(--font);
    padding: 10px;
    text-align: left;
}

.information-table {
    width: 100%;
}

.information-table tbody td {
    text-align: left;
    vertical-align: super;
}

.information-table tbody tr td:first-child {
    width: 110px
}

@media (width <=770px) {
    .table-container-multiple {
        flex-direction: column;
        width: 100%;
    }

    .table-container-duo {
        grid-template-columns: 1fr;
    }
}

@media (width <=570px) {
    h2 {
        text-align: center;
    }

    .table-container-duo,
    .table-container-full-width,
    .table-container {
        width: 100%;
        align-self: flex-start;
    }


    .table-container-full-width table {
        width: 700px;
    }
}
</style>
