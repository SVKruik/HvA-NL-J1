# Cloud Solutions 2024 - Mixit

[![Flask][Flask.py]][Flask-url]
[![Vue][Vue.js]][Vue-url]
[![PowerApps][PowerApps]][PowerApps-Url]
[![SQLAlchemy][SQLAlchemy]][SQLAlchemy-Url]

### Introductie

Dit project is een collaboratie vanuit de [Hogeschool van Amsterdam](https://www.hva.nl) - hierna de HvA - met [Mixit the Employee Experience Company](https://www.mixit.nl) - hierna Mixit - als opdrachtgever. Mixit stelde drie verschillende projecten voor. Deze staan later in dit document beschreven. In deze iteratie van het Themasemester/Minor Cloud Solutions is er gekozen voor een nieuw project vanaf nul.

### Inhoudsopgave

<details>
  <summary>Inhoudsopgave</summary>
  <ol>
    <li>
      <a href="#Het-project">het Project</a>
      <ul>
        <li><a href="#Het-team">het team</a></li>
        <li><a href="#De-scenario’s">De scenario’s</a></li>
        <li><a href="#Voortgang">Voortgang</a></li>
        <li><a href="#Technologieen">Gebruikte technologieën</a></li>
      </ul>
    </li>
  </ol>
</details>

### Het Team

Toen het semester van start ging waren er twee aparte groepen. Doordat verschillende teamleden stopten met het teamproject en we aan hetzelfde project werkten, zijn we op ongeveer de helft van het semester samengegaan. Hieronder staan de leden die het semester hebben afgerond:

| Naam               | Studie                 |
| --------------     | --------------         |
| Damian Breidel     | Human Resources        |
| Guido Plugge       | Technische Informatica |
| Junior Brito Perez | Software Engineering   |
| Quentin Neuféglise | Cyber Security         |
| Stefan Kruik       | Software Engineering   |
| Tycho Smit         | Cyber Security         |

### De Scenario's

Bij elk scenario wordt er eerst aangegeven wat de casus was hoe hij aangeleverd was. Daarna beschrijven wij voor scenario 1 onze interpretatie na verschillende meetings en voor de andere scenario's waarom deze niet gekozen is.

#### Scenario 1

> Abstract

Maak (automatische) functionaliteit wat de belangrijkste documenten uit een klantproject borgt.

- Houd rekening met 2 tenants: de klant omgeving en de Mixit omgeving.
- Veel documenten zijn ontworpen op basis van standaard templates en vorige projecten.
- Bedenk goed welke input je van onze collega’s vraagt tijdens het proces en wat je kan automatiseren.

> Interpretatie

Dit het scenario/casus waarmee we in zee zijn gegaan. Dit was een redelijk groot en breed project, waar Mixit ons redelijk veel vrijheid in gaf. 'At the core' ging het om het automatiseren van het invullen en opslaan van templates. Het doel was een stand-alone applicatie als aanvulling op de Microsoft SharePoint omgeving van Mixit. Zij gaven aan dat de vindbaarheid van documenten slecht is, en dat de huidige omgeving veel te wensen laat. Andere grote functionaliteiten die op de wensenlijst stonden zijn het groeperen van documenten per team/groep, en het bijhouden van alle bezigheden in tijdlijnen en overzichten.

#### Scenario 2

> Abstract

Maak inzichtelijk welke consultant aan welk project werkt en hoeveel tijd deze persoon nog in de planning heeft.

- Koppel hier het planningssysteem (exact online) en de outlook-agenda van de collega aan elkaar.
- Geef suggesties voor projecten waar de consultant met tijd over aan kan werken op basis van uitgevallen collega’s
- Geef suggesties op de basis van de interne backlog en expertises van collega’s voor het besteden van uren.
- Geef suggesties op basis van de status van projecten (on schedule, ahead of schedule, behind schedule)
- Houd hier ook rekening mee met externe capaciteit te benutten.

> Afgevallen

Er is niet voor dit project gekozen omdat de ontwikkelteams zouden moeten integreren in het Exact systeem. Dit vereist veel gevoelige rechten en uitvoerige kennis over het systeem. Mixit regelt haar boekhouding en andere gevoelige processen in Exact, wat ontwikkelen zonder risico's onmogelijk maakt. De optie voor een speciaal developer account bestaat, maar deze zou dan zwaar gelimiteerd zijn en ontwikkeling hinderen wat resulteert in een product wat geen meerwaarde levert.

#### Scenario 3

> Abstract

Geef weer wie er op kantoor aanwezig zijn aan de hand van met welk WiFi-netwerk ze verbonden zijn.

- Denk goed over hoe je dit kan weergeven en integreren met bestaande M365 applicaties

> Afgevallen

Er is niet voor dit project gekozen omdat er een web applicatie gebouwd moest worden, en browsers geen tot weinig toegang hebben tot de hardware in de buurt. Hoewel er in het begin onderzoek naar gedaan is en er een paar oplossingen/mogelijkheden gevonden zijn, zou dit veel nieuwe kennis vereisen. Iets wat buiten de scope is van dit Themasemester. Daarnaast vereist dit ook toegang en kennis over de netwerk-infrastructuur van Mixit. Ook deze casus bleek dus niet reëel te zijn.

### Het Project

In dit hoofdstuk wordt de complete flow van sprint 1 tot en met sprint 6 (onze werkwijze, iteratieve 'sprints' van 2 tot 3 weken) beschreven, waar we het over de problemen en successen van het project hebben. We gaan niet te veel in technisch detail, maar we proberen de situaties wel goed te schetsen.

> Sprint 1

Het prille begin van het project. Deze sprint was vooral voor het kennismaken met Mixit zelf en de casus, en hebben beide teams onderzoek gedaan. We hebben destijds ook een presentatie gegeven over onze interpretatie van het project. Het was toen ook nog niet duidelijk of het een nieuw project ging worden, dus hebben sommige leden zich verdiept in het oude product die voor de zorg was.

> Sprint 2

Dit was de eerste sprint waar we aan de slag gingen met het project zelf, of in ieder geval een poging tot. In deze sprint begonnen de eerste problemen namelijk. Na een meeting met Daan de Wolf van Mixit waar we concreet alle gewenste functionaliteiten afstelden, wisten we goed waarmee we aan de slag moesten. De twee grootste doelen die we voor ogen hadden is het bouwen van een applicatie die inloggen met Microsoft ondersteunt, en die de bestanden van die ingelogde omgeving ophaalt. Toen bleek al snel dat we te weinig rechten hadden. We hebben verschillende dingen geprobeerd maar toch kwamen we niet verder. Onze docent, Peter Odenhoven, heeft ook contact gehad met de ICT-afdeling van de HvA zodat zij ons meer rechten konden geven. Maar de vereiste rechten bleken erg gevoelig te zijn, en dat was eindelijk ook niet gelukt. Als we de rechten van de HvA kregen, was er de mogelijkheid dat we per ongeluk veel kosten konden maken.

Het team zat stil en al enkele weken zonder project. Hoewel je voor het Themasemester Cloud Solutions nog andere activiteiten hebt dan alleen het teamproject (individuele leerdoelen en portfolio's), betekende deze vertraging al wel dat we een grote achterstand hebben opgelopen. Sommige teamleden begonnen zich zorgen te maken of er nog wat van zou komen, en of we uiteindelijk genoeg over de Cloud zouden leren.

> Sprint 3

Om toch aan het werk te kunnen zijn we afgestapt van de Azure omgeving van de HvA, en hebben we een eigen omgeving aangemaakt waar wij dus volledige rechten tot hebben. Dit was een goede zet, en het team kon eindelijk aan de slag. Al snel is er een Frontend in elkaar gezet. Omdat tijd begon te dringen, hebben we voor communicatie met SharePoint (ophalen van bestanden etc.) gekozen voor een lowcode tool: PowerApps. Dit is een drag & drop dienst waarmee je met SharePoint kan praten. Dit is in plaats van handmatig de Microsoft API aanroepen, wat meer tijd en expertise vereist. Ook dit was een goede zet, want al snel konden we ook bestanden en andere onderdelen tonen op onze applicatie. Alle teamleden kregen toen de opdracht zich te gaan verdiepen in deze PowerApps, zodat iedereen hier aan kan werken.

> Sprint 4

Het project verliep dus eindelijk soepel, en we hebben al enkele wensen van Mixit kunnen vervullen. In deze sprint zijn ook de teams samengevoegd, wat zorgde voor meer mankracht. We hebben deze sprint een prototype kunnen maken, die we in een online meeting aan Mixit hebben laten zien. Mixit was op de hoogte van al onze problemen, en was daarom tevreden met onze applicatie tot zover. Zij hebben ons feedback en prioriteiten gegeven waarmee wij aan de slag konden de komende twee sprints. Ook heeft Mixit ons een Azure/Microsoft omgeving gegeven, en zijn we hier naartoe gemigreerd. Dit verliep net als de team-samenvoeging soepel. 

> Sprint 5

Toen we aan de slag wilden met de nieuwe functionaliteiten die Mixit in het gesprek ons gegeven heeft, kwamen we erachter dat PowerApps toch wat limitaties heeft. Het is een redelijk krachtige tool, maar bleek toch ontoereikend voor ons doeleinde. We hebben in deze sprint dus nog enkele functionaliteiten kunnen opleveren, maar helaas ook veel zaken moeten laten varen. De meest belangrijke functionaliteit (invullen & uploaden templates) was gelukkig wel mogelijk, maar vereiste veel kennis en inspanning van één van de teamleden.

Omdat we een Themasemester Cloud doen, wilde het team op een gegeven moment ook graag aan de slag met deployment. Het was deze sprint al gelukt om alle onderdelen (Frontend, Backend & Database) op Azure te krijgen, alhoewel werkten deze niet met elkaar samen. Alles werkte nog individueel, en de Frontend communiceerde bijvoorbeeld nog niet met de Backend.

> Sprint 6

Dit was de laatste sprint van dit Themasemester. Op wat kleine fixes aan het product na, hebben we ons vooral gefocussed op geautomatiseerde en volledige deployment. Zoals in sprint 5 beschreven staat werkte alles nog individueel, waar natuurlijk verandering in gebracht moest worden. Ook hebben we aan de verschillende documentatie onderdelen gewerkt die in het hoofdstuk [Handover](#Handover) beschreven staan.

In de laatste week van sprint 6 hadden twee belangrijke presentaties: de dinsdag op kantoor bij Mixit en donderdag de Digital Creators Markt. Beide waren erg spannend, want niet iedereen was tevreden met het eindresultaat. Door overmacht en limitaties hebben we niet alles kunnen opleveren wat Mixit aan ons gevraagd heeft, en we waren dus benieuwd wat Mixit er uiteindelijk van vond. Twee leden hebben de presentatie gegeven (bijlage 4) waarna we de demonstratie van het product deden. Mixit zag in dat we door alle bovengenoemde problemen minder hebben kunnen opleveren dan geplanned, en was toch blij dat we in ieder geval het uploaden van bestanden voor elkaar hebben gekregen. Dit was de hoofdfunctionaliteit waar zij gevraagd om hebben. De presentatie was dus toch een succes. Uiteindelijk hebben we dus een antwoord kunnen geven op de vraag of het gevraagde product mogelijk is, en of een verdere iteratie in een volgend semester verstandig is. De consensus was dat het antwoord hierop nee is, want het hele team heeft zijn best gedaan om alle beschikbare diensten zoals PowerApps qua functionaliteit uit te putten.

Dan het laatste school moment: de Digital Creators markt op donderdag. Dit is een evenement georganiseerd door de HvA, waar studenten die een Themasemester gevolgd hebben hun applicatie/werk laten zien. Dit is zodat voor andere 2e jaars studenten die geïnteresseerd zijn in de andere Themasemesters, en voor studenten in de basisfase die nog een keuze moet maken. Wij hebben hier trots onze applicatie laten zien met bijlage 3 als ondersteuning. Wij hebben verschillende geïnteresseerde studenten te woord gestaan en laten zien hoe en wat we gemaakt hebben.

En dat is het einde van het project en tevens het semester. Het was een interessant en uitdagend project, wat nauwe communicatie met verschillende groepen vereiste. Door de begripvolle en meedenkende houding van Mixit vond het team het erg fijn om met hen te werken.

### Handover

Als dit document gebruikt wordt als Handover (overdracht van code & uitleg) naar Mixit, zijn er verschillende bijlagen die hierbij horen:

| ID | Naam | Soort | Beschrijving |
| - | - | - | - |
| 1 | README.md | Markdown | Dit document. Algemene uitleg en introductie. |
| 2 | Installation Guide.md | Markdown | Stappenplan voor het lokaal opstarten & deployment. |
| 3 | Mixit - Digital Creators.pdf | PDF | De gebruikte presentatie tijdens het HvA Digital Creators evenement. |
| 4 | Mixit - Eindoplevering.pdf | PDF | De gebruikte presentatie tijdens ons bezoek in Rotterdam, tevens de eindoplevering. |

<!-- Links -->

[Flask.py]: https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[PowerApps]: https://img.shields.io/badge/-PowerApps-%23C04392?style=for-the-badge
[PowerApps-Url]: https://make.powerapps.com
[SQLAlchemy]: https://img.shields.io/badge/-SQLAlchemy-%FF0000?style=for-the-badge
[SQLAlchemy-Url]: https://www.sqlalchemy.org
