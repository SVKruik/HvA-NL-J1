import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.live.js";

async function queryCountries() {
    const aantalReizigers = {
        'België': 0,
        'Egypte': 0,
        'Gambia': 0,
        'Nederland': 0,
        'Spanje': 0,
        'Turkije': 0,
        'Duitsland': 0,
        'Oostenrijk': 0,
        'Qatar': 0,
        'Roemenië': 0,
        'Zwitserland': 0,
        'Polen': 0,
        'Rusland': 0,
        'Engeland': 0,
    };
    const query = "SELECT land, COUNT(land) AS aantal FROM `target_interesse` GROUP BY land;";
    await FYSCloud.API.queryDatabase(
        query
    ).then((data) => {
        data.forEach(reizigersAantal => {
            if (aantalReizigers[reizigersAantal.land] !== undefined) {
                aantalReizigers[reizigersAantal.land] = reizigersAantal.aantal
            };
        });
    }).catch((reason) => {
        console.log(reason);
    });
    return aantalReizigers;
};

async function createMap(aantalReizigers) {
    const values = { // ISO 2, 14
        BE: { link: "kaart-redirect.html?be", reizigers: aantalReizigers['België'] }, // Belgium
        EG: { link: "kaart-redirect.html?eg", reizigers: aantalReizigers['Egypte'] }, // Egypt
        GM: { link: "kaart-redirect.html?gm", reizigers: aantalReizigers['Gambia'] }, // Gambia
        NL: { link: "kaart-redirect.html?nl", reizigers: aantalReizigers['Nederland'] }, // Netherlands
        ES: { link: "kaart-redirect.html?es", reizigers: aantalReizigers['Spanje'] }, // Spain
        TR: { link: "kaart-redirect.html?tr", reizigers: aantalReizigers['Turkije'] }, // Turkey
        DE: { link: "kaart-redirect.html?de", reizigers: aantalReizigers['Duitsland'] }, // Germany
        AT: { link: "kaart-redirect.html?at", reizigers: aantalReizigers['Oostenrijk'] }, // Austria
        QA: { link: "kaart-redirect.html?qa", reizigers: aantalReizigers['Qatar'] }, // Qatar
        RO: { link: "kaart-redirect.html?ro", reizigers: aantalReizigers['Roemenië'] }, // Romania
        CH: { link: "kaart-redirect.html?ch", reizigers: aantalReizigers['Zwitserland'] }, // Switzerland
        PL: { link: "kaart-redirect.html?pl", reizigers: aantalReizigers['Polen'] }, // Poland
        RU: { link: "kaart-redirect.html?ru", reizigers: aantalReizigers['Rusland'] }, // Russia
        GB: { link: "kaart-redirect.html?gb", reizigers: aantalReizigers['Engeland'] } // Great Britain
    };
    new svgMap({
        targetElementID: 'svgMap',
        data: {
            data: {
                reizigers: {
                    name: 'Reizigers',
                    format: '{0}',
                    thousandSeparator: '.',
                }
            },
            applyData: 'reizigers',
            values: values
        }
    });
};

document.addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault();
    queryCountries().then(countryData => {
        createMap(countryData);
    });
});
