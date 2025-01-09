package nl.hva.ict.ads.elections.models;

import nl.hva.ict.ads.utils.PathUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.util.*;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class ElectionTest {
    private static final int[] numbersOfCandidatesByParty = {
            -1,
            80,   // VVD
            80,   // D66
            54,   // GROENLINKS / Partij van de Arbeid (PvdA)
            45,   // PVV (Partij voor de Vrijheid)
            49,   // CDA
            50,   // SP (Socialistische Partij)
            54,   // Forum voor Democratie
            50,   // Partij voor de Dieren
            50,   // ChristenUnie
            21,   // Volt
            38,   // JA21
            44,   // Staatkundig Gereformeerde Partij (SGP)
            46,   // DENK
            24,   // 50PLUS
            52,   // BBB
            15,   // BIJ1
            34,   // Piratenpartij - De Groenen
            50,   // BVNL / Groep Van Haga
            44,   // Nieuw Sociaal Contract
            31,   // Splinter
            19,   // LP (Libertaire Partij)
            20,   // LEF - Voor de Nieuwe Generatie
            28,   // Samen voor Nederland
            17,   // Nederland met een PLAN
            10,   // PartijvdSport
            11,   // Politieke Partij voor Basisinkomen
    };
    private final static int CDA_PARTY_ID = 5;
    private static final int[] numbersOfCDARegistrationsByConstituency = {
            -1,
            -1,   // None
            -1,   // None
            -1,   // None
            -1,   // None
            -1,   // None
            -1,   // None
            -1,   // None
            49,   // 8 Utrecht
            49,   // 9 Amsterdam
    };
    private static final int[] expectedNumberOfVotesByParty = {
            -1,
            341,   // VVD
            304,   // D66
            1507,   // GROENLINKS / Partij van de Arbeid (PvdA)
            116,   // PVV (Partij voor de Vrijheid)
            16,   // CDA
            73,   // SP (Socialistische Partij)
            45,   // Forum voor Democratie
            229,   // Partij voor de Dieren
            8,   // ChristenUnie
            213,   // Volt
            13,   // JA21
            5,   // Staatkundig Gereformeerde Partij (SGP)
            141,   // DENK
            4,   // 50PLUS
            14,   // BBB
            157,   // BIJ1
            12,   // Piratenpartij - De Groenen
            3,   // BVNL / Groep Van Haga
            142,   // Nieuw Sociaal Contract
            1,   // Splinter
            2,   // LP (Libertaire Partij)
            7,   // LEF - Voor de Nieuwe Generatie
            0,   // Samen voor Nederland
            2,   // Nederland met een PLAN
            1,   // PartijvdSport
            0,   // Politieke Partij voor Basisinkomen
    };
    static Election election;

    @BeforeAll
    static void setup() throws IOException, XMLStreamException {
        election = Election.importFromDataFolder(PathUtils.getResourcePath("/EML_bestanden_TK2023_HvA_UvA"));
    }

    private static Stream<Arguments> streamNumbersOfCandidatesByParty() {
        return election.getParties().stream()
                .map(p -> Arguments.of(p, numbersOfCandidatesByParty[p.getId()]));
    }

    private static Stream<Arguments> streamNumbersOfRegistrationsByConstituency() {
        Map<Constituency, Integer> numbersOfRegistrationsByConstituency =
                election.numberOfRegistrationsByConstituency(election.getParty(CDA_PARTY_ID));
        return election.getConstituencies().stream()
                .map(c -> Arguments.of(c, numbersOfCDARegistrationsByConstituency[c.getId()], numbersOfRegistrationsByConstituency));
    }

    private static Stream<Arguments> streamNumbersOfVotesByParty() {
        int totalVotes = Arrays.stream(expectedNumberOfVotesByParty).filter(v -> v >= 0).sum();
        final Map<Party, Integer> votesByParty = election.getVotesByParty();
        assertEquals(totalVotes, Election.integersSum(votesByParty.values()),
                "Total number of casted votes does not match expectation");

        return election.getParties().stream()
                .map(p -> Arguments.of(p, expectedNumberOfVotesByParty[p.getId()], votesByParty));
    }

    @Test
    void allConstituenciesShouldHaveBeenLoaded() {
        assertEquals(2, election.getConstituencies().size(), "Not all constituencies have been found from the XML input");
    }

    @Test
    void allPartiesShouldHaveBeenRegisteredByUniqueId() {
        assertEquals(26, election.getParties().size(), "Not all parties have been found from the XML input");
    }

    @Test
    void constituenciesShouldReferenceSharedInstancesOfParties() {
        for (Constituency c : election.getConstituencies())
            for (Party p : c.getParties()) {
                Party electionParty = election.getParty(p.getId());
                assertSame(electionParty, p,
                        String.format("Party %s in Constituency %s is a duplicate instance of party %s in the election.", p, c, electionParty));
            }
    }

    @Test
    void electionShouldReferenceASingleInstanceOfEachUniqueCandidate() {
        assertEquals(1016, election.getAllCandidates().size(), "Not all candidates have been found, or unique candidates have not been identified properly by party and by name.");
    }

    @Test
    void checkTotalNumberOfPollingStations() {
        int numPollingStations = election.getConstituencies().stream().mapToInt(c -> c.getPollingStations().size()).sum();
        assertEquals(3, numPollingStations);
    }

    @Test
    void candidatesWithDuplicateNamesShouldBeFound() {
        Set<Candidate> candidates = election.getCandidatesWithDuplicateNames();
        assertEquals(2, candidates.size(),
                String.format("Incorrect number of candidates found in %s", candidates));
    }

    @Test
    void getPollingStationsByZipCodeRange() {
        String expected = "[PollingStation{id='0363::SB126',zipCode='1091GH',name='Stembureau Hogeschool van Amsterdam, Wibauthuis'}, PollingStation{id='0363::SB159',zipCode='1091GH',name='Stembureau Hogeschool van Amsterdam, Leeuwenburg'}]";

        Collection<PollingStation> pollingStations = election.getPollingStationsByZipCodeRange("1091AA", "1098ZZ");
        assertEquals(2, pollingStations.size(),
                String.format("Incorrect number of polling stations found in %s\nExpected: %s", pollingStations, expected));

        pollingStations = election.getPollingStationsByZipCodeRange("1091AA", "1091ZZ");
        assertEquals(1, pollingStations.size(),
                String.format("Incorrect number of polling stations found in %s\nExpected: %s", pollingStations, expected));

        pollingStations = election.getPollingStationsByZipCodeRange("1091ZZ", "1098ZZ");
        assertEquals(1, pollingStations.size(),
                String.format("Incorrect number of polling stations found in %s\nExpected: %s", pollingStations, expected));
    }

    @Test
    void getVotesByPartyAcrossPollingStations() {
        String expected = "{Party{id=1,name='VVD'}=156, Party{id=2,name='PVV (Partij voor de Vrijheid)'}=40, Party{id=3,name='CDA'}=30, Party{id=4,name='D66'}=497, Party{id=5,name='GROENLINKS'}=255, Party{id=6,name='SP (Socialistische Partij)'}=60, Party{id=7,name='Partij van de Arbeid (P.v.d.A.)'}=117, Party{id=8,name='ChristenUnie'}=8, Party{id=9,name='Partij voor de Dieren'}=162, Party{id=10,name='50PLUS'}=4, Party{id=11,name='Staatkundig Gereformeerde Partij (SGP)'}=3, Party{id=12,name='DENK'}=83, Party{id=13,name='Forum voor Democratie'}=33, Party{id=14,name='BIJ1'}=137, Party{id=15,name='JA21'}=19, Party{id=16,name='CODE ORANJE'}=4, Party{id=17,name='Volt'}=197, Party{id=18,name='NIDA'}=29, Party{id=19,name='Piratenpartij'}=7, Party{id=20,name='LP (Libertaire Partij)'}=5, Party{id=21,name='JONG'}=1, Party{id=22,name='Splinter'}=4, Party{id=23,name='BBB'}=1, Party{id=24,name='NLBeter'}=2, Party{id=25,name='Lijst Henk Krol'}=1, Party{id=26,name='OPRECHT'}=0, Party{id=27,name='JEZUS LEEFT'}=1, Party{id=28,name='Trots op Nederland (TROTS)'}=0, Party{id=29,name='U-Buntu Connected Front'}=0, Party{id=31,name='Partij van de Eenheid'}=1, Party{id=33,name='Vrij en Sociaal Nederland'}=0, Party{id=36,name='De Groenen'}=0, Party{id=37,name='Partij voor de Republiek'}=0}";
        Collection<PollingStation> pollingStations = election.getPollingStationsByZipCodeRange("1091AA", "1099ZZ");
        Map<Party, Integer> votesByParty = election.getVotesByPartyAcrossPollingStations(pollingStations);
        assertEquals(2504, Election.integersSum(votesByParty.values()),
                String.format("Incorrect total number of votes found in %s\nExpected: %s", votesByParty, expected));
    }

    @ParameterizedTest(name = "Party {0} should have {1} candidates")
    @MethodSource("streamNumbersOfCandidatesByParty")
    void everyPartyShouldHoldCorrectNumberOfCandidates(final Party party, final int numberOfCandidates) {
        assertEquals(numberOfCandidates, party.getCandidates().size(),
                String.format("%s does not register the correct number of candidates in its list. Unique candidates may not have been identified properly.", party));
    }

    @ParameterizedTest(name = "Constituency {0} should have {1} registrations")
    @MethodSource("streamNumbersOfRegistrationsByConstituency")
    void everyConstituencyShouldHoldCorrectNumberOfRegistrations(final Constituency constituency, final int expectedNumberOfRegistrations,
                                                                 Map<Constituency, Integer> numbersOfRegistration) {
        assertEquals(expectedNumberOfRegistrations, numbersOfRegistration.get(constituency),
                String.format("%s does not hold the correct number of registrations in its map. Unique rank or candidates may not have been identified properly.", constituency));
    }

    @ParameterizedTest(name = "Party {0} should have got {1} votes")
    @MethodSource("streamNumbersOfVotesByParty")
    void everyPartyShouldHaveWonCorrectNumberOfVotes(final Party party, final int expectedNumberOfVotes,
                                                     Map<Party, Integer> votesByParty) {

        // skip parties without vote counts by polling stations
        if (expectedNumberOfVotes < 0) return;
        assertEquals(expectedNumberOfVotes, votesByParty.get(party),
                String.format("%s does not win the correct number of votes.", party));
    }

    @Test
    void sortedElectionResultsByPartyPercentageShouldReturnCorrectRanking() {
        int totalVotes = Arrays.stream(expectedNumberOfVotesByParty).filter(v -> v >= 0).sum();
        Map<Party, Integer> electionResults = election.getVotesByParty();

        final int firstRankedPartyId = 3;   // GROENLINKS / Partij van de Arbeid (PvdA)
        final int secondRankedPartyId = 1;  // VVD
        final int thirdRankedPartyId = 2;   // D66
        assertEquals(List.of(Map.entry(election.getParty(firstRankedPartyId), 100.0 * expectedNumberOfVotesByParty[firstRankedPartyId] / totalVotes),
                        Map.entry(election.getParty(secondRankedPartyId), 100.0 * expectedNumberOfVotesByParty[secondRankedPartyId] / totalVotes),
                        Map.entry(election.getParty(thirdRankedPartyId), 100.0 * expectedNumberOfVotesByParty[thirdRankedPartyId] / totalVotes)
                ),
                Election.sortedElectionResultsByPartyPercentage(3, electionResults),
                "Overall election result is not properly calculated or ranked");
    }

    @Test
    void mostRepresentativePollingStationShouldBeFound() {
        String expected = "PollingStation{id='0363::SB126',zipCode='1091GH',name='Stembureau Hogeschool van Amsterdam, Wibauthuis'}";
        PollingStation mostRepresentativeStation = election.findMostRepresentativePollingStation();

        assertNotNull(mostRepresentativeStation,
                "The most representative polling station was not found.");
        assertEquals("1091GH", mostRepresentativeStation.getZipCode(),
                String.format("%s is not the most representative; expected: %s", mostRepresentativeStation, expected));
        assertEquals("0363::SB126", mostRepresentativeStation.getId().substring(0, 11),
                String.format("%s is not the most representative; expected: %s", mostRepresentativeStation, expected));
    }
}
