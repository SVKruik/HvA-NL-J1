package nl.hva.ict.ads.elections.models;

import nl.hva.ict.ads.utils.PathUtils;
import nl.hva.ict.ads.utils.xml.XMLParser;

import javax.xml.stream.XMLStreamException;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.text.DecimalFormat;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Holds all election data per consituency
 * Provides calculation methods for overall election results
 */
public class Election {

    private final String name;
    // all (unique) parties in this election, organised by Id
    // will be build from the XML
    protected Map<Integer, Party> parties;
    // all (unique) constituencies in this election, identified by Id
    protected Set<Constituency> constituencies;

    public Election(String name) {
        this.name = name;
        this.parties = new HashMap<>();
        this.constituencies = new TreeSet<>(Comparator.comparing(Constituency::getId));
    }

    /**
     * Transforms and sorts decreasingly vote counts by party into votes percentages
     * by party
     * The party with the highest vote count shall be ranked upfront
     * The votes percentage by party is calculated from 100.0 * partyVotes /
     * totalVotes;
     *
     * @return the sorted list of (party,votesPercentage) pairs with the highest
     *         percentage upfront
     */
    public static List<Map.Entry<Party, Double>> sortedElectionResultsByPartyPercentage(int tops,
            Map<Party, Integer> votesCounts) {
        int totalVotes = votesCounts.values().stream().mapToInt(Integer::intValue).sum();

        return votesCounts.entrySet().stream()
                .map(entry -> Map.entry(entry.getKey(), 100.0 * entry.getValue() / totalVotes))
                .sorted(Map.Entry.<Party, Double>comparingByValue().reversed())
                .limit(tops)
                .collect(Collectors.toList());
    }

    /**
     * auxiliary method to calculate the total sum of a collection of integers
     *
     * @param integers
     * @return
     */
    public static int integersSum(Collection<Integer> integers) {
        return integers.stream().reduce(Integer::sum).orElse(0);
    }

    /**
     * Reads all data of Parties, Candidates, Contingencies and PollingStations from
     * available files in the given folder and its subfolders
     * This method can cope with any structure of sub folders, but does assume the
     * file names to comply with the conventions
     * as found from downloading the files from
     * https://data.overheid.nl/dataset/verkiezingsuitslag-tweede-kamer-2023
     * So, you can merge folders after unpacking the zip distributions of the data,
     * but do not change file names.
     *
     * @param folderName the root folder with the data files of the election results
     * @return een Election met alle daarbij behorende gegevens.
     * @throws XMLStreamException bij fouten in een van de XML bestanden.
     * @throws IOException        als er iets mis gaat bij het lezen van een van de
     *                            bestanden.
     */
    public static Election importFromDataFolder(String folderName) throws XMLStreamException, IOException {
        System.out.println("Loading election data from " + folderName);
        Election election = new Election(folderName);
        int progress = 0;
        Map<Integer, Constituency> kieskringen = new HashMap<>();
        for (Path constituencyCandidatesFile : PathUtils.findFilesToScan(folderName, "Kandidatenlijsten_TK2023_")) {
            XMLParser parser = new XMLParser(new FileInputStream(constituencyCandidatesFile.toString()));
            Constituency constituency = Constituency.importFromXML(parser, election.parties);
            // election.constituenciesM.put(constituency.getId(), constituency);
            election.constituencies.add(constituency);
            showProgress(++progress);
        }
        System.out.println();
        progress = 0;
        for (Path votesPerPollingStationFile : PathUtils.findFilesToScan(folderName, "Telling_TK2023_gemeente")) {
            XMLParser parser = new XMLParser(new FileInputStream(votesPerPollingStationFile.toString()));
            election.importVotesFromXml(parser);
            showProgress(++progress);
        }
        System.out.println();
        return election;
    }

    protected static void showProgress(final int progress) {
        System.out.print('.');
        if (progress % 50 == 0)
            System.out.println();
    }

    /**
     * finds all (unique) parties registered for this election
     *
     * @return all parties participating in at least one constituency, without
     *         duplicates
     */
    public Collection<Party> getParties() {
        return this.parties.values();
    }

    /**
     * finds the party with a given id
     *
     * @param id
     * @return the party with given id, or null if no such party exists.
     */
    public Party getParty(int id) {
        return this.parties.get(id);
    }

    public Set<? extends Constituency> getConstituencies() {
        return this.constituencies;
    }

    /**
     * finds all unique candidates across all parties across all constituencies
     * organised by increasing party-id
     *
     * @return alle unique candidates organised by increasing party-id
     */
    public List<Candidate> getAllCandidates() {
        return this.parties.values().stream()
                .flatMap(party -> party.getCandidates().stream())
                .distinct()
                .sorted(Comparator.comparingInt(candidate -> candidate.getParty().getId()))
                .collect(Collectors.toList());
    }

    /**
     * Retrieve for the given party the number of Candidates that have been
     * registered per Constituency
     *
     * @param party
     * @return
     */
    public Map<Constituency, Integer> numberOfRegistrationsByConstituency(Party party) {
        return this.constituencies.stream()
                .collect(Collectors.toMap(Function.identity(),
                        constituency -> constituency.getCandidates(party).size()));
    }

    /**
     * Finds all Candidates that have a duplicate name against another candidate in
     * the election
     * (can be in the same party or in another party)
     *
     * @return
     */
    public Set<Candidate> getCandidatesWithDuplicateNames() {
        // Group
        Map<String, List<Candidate>> candidatesByName = this.getAllCandidates().stream()
                .collect(Collectors.groupingBy(Candidate::getFullName));

        // Filter Duplicate
        return candidatesByName.values().stream()
                .filter(group -> group.size() > 1)
                .flatMap(Collection::stream)
                .sorted(Comparator.comparing(Candidate::getFullName))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    /**
     * Retrieve from all constituencies the combined sub set of all polling stations
     * that are located within the area of the specified zip codes
     * i.e. firstZipCode <= pollingStation.zipCode <= lastZipCode
     * All valid zip codes adhere to the pattern 'nnnnXX' with 1000 <= nnnn <= 9999
     * and 'AA' <= XX <= 'ZZ'
     *
     * @param firstZipCode
     * @param lastZipCode
     * @return the sub set of polling stations within the specified zipCode range
     */
    public Collection<PollingStation> getPollingStationsByZipCodeRange(String firstZipCode, String lastZipCode) {
        return this.constituencies.stream()
                .map(constituency -> constituency.getPollingStationsByZipCodeRange(firstZipCode, lastZipCode))
                .filter(pollingStations -> pollingStations != null && !pollingStations.isEmpty())
                .flatMap(NavigableSet::stream)
                .collect(Collectors.toCollection(() -> new TreeSet<>(Constituency.POLLING_STATION_COMPARATOR)));
    }

    /**
     * Retrieves per party the total number of votes across all candidates,
     * constituencies and polling stations
     *
     * @return
     */
    public Map<Party, Integer> getVotesByParty() {
        Map<Party, Integer> votesByParty = new HashMap<>();
        for (Constituency constituency : this.constituencies) {
            votesByParty.putAll(constituency.getVotesByParty());
        }
        return votesByParty;
    }

    /**
     * Retrieves per party the total number of votes across all candidates,
     * that were cast in one out of the given collection of polling stations.
     * This method is useful to prepare an election result for any sub-area of a
     * Constituency.
     * Or to obtain statistics of special types of voting, e.g. by mail.
     *
     * @param pollingStations the polling stations that cover the sub-area of
     *                        interest
     * @return
     */
    public Map<Party, Integer> getVotesByPartyAcrossPollingStations(Collection<PollingStation> pollingStations) {
        return pollingStations.stream()
                .flatMap(pollingStation -> pollingStation.getVotesByParty().entrySet().stream())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, Integer::sum));
    }

    /**
     * Find the most representative Polling Station, which has got its votes
     * distribution across all parties
     * the most alike the distribution of overall total votes.
     * A perfect match is found, if for each party the percentage of votes won at
     * the polling station
     * is identical to the percentage of votes won by the party overall in the
     * election.
     * The most representative Polling Station has the smallest deviation from that
     * perfect match.
     * <p>
     * There are different metrics possible to calculate a relative deviation
     * between distributions.
     * You may use the helper method
     * {@link #euclidianVotesDistributionDeviation(Map, Map)}
     * which calculates a relative least-squares deviation between two
     * distributions.
     *
     * @return the most representative polling station.
     */
    public PollingStation findMostRepresentativePollingStation() {
        // Total Votes
        Map<Party, Integer> overallVotes = this.getVotesByParty();

        // Polling Station - Lowest Deviation
        return this.constituencies.stream()
                .flatMap(constituency -> constituency.getPollingStations().stream())
                .min(Comparator.comparingDouble(
                        ps -> this.euclidianVotesDistributionDeviation(ps.getVotesByParty(), overallVotes)))
                .orElse(null);
    }

    /**
     * Calculates the Euclidian distance between the relative distribution across
     * parties of two voteCounts.
     * If the two relative distributions across parties are identical, then the
     * distance will be zero
     * If some parties have relatively more votes in one distribution than the
     * other, the outcome will be positive.
     * The lower the outcome, the more alike are the relative distributions of the
     * voteCounts.
     * ratign of votesCounts1 relative to votesCounts2.
     * see
     * https://towardsdatascience.com/9-distance-measures-in-data-science-918109d069fa
     *
     * @param votesCounts1 one distribution of votes across parties.
     * @param votesCounts2 another distribution of votes across parties.
     * @return de relative distance between the two distributions.
     */
    private double euclidianVotesDistributionDeviation(Map<Party, Integer> votesCounts1,
            Map<Party, Integer> votesCounts2) {
        // calculate total number of votes in both distributions
        int totalNumberOfVotes1 = integersSum(votesCounts1.values());
        int totalNumberOfVotes2 = integersSum(votesCounts2.values());

        // we calculate the distance as the sum of squares of relative voteCount
        // distribution differences per party
        // if we compare two voteCounts that have the same relative distribution across
        // parties, the outcome will be zero

        return votesCounts1.entrySet().stream()
                .mapToDouble(e -> Math.pow(e.getValue() / (double) totalNumberOfVotes1 -
                        votesCounts2.getOrDefault(e.getKey(), 0) / (double) totalNumberOfVotes2, 2))
                .sum();
    }

    public String prepareSummary(int partyId) {
        // Party Specific Summary
        Party party = this.getParty(partyId);
        StringBuilder summary = new StringBuilder()
                .append("\nSummary of ").append(party).append(":\n\n");

        // Candidates Total
        if (party == null)
            return null;
        int totalCandidates = party.getCandidates().size();
        summary.append("Total number of candidates: ").append(totalCandidates).append("\n");

        // Candidates Names
        summary.append("Candidates: ").append(party.getCandidates()).append("\n\n");

        // Registrations Total
        int totalRegistrations = this.constituencies.stream()
                .mapToInt(con -> con.getCandidates(party).size())
                .sum();
        summary.append("Total number of registrations = ").append(totalRegistrations).append("\n");

        // Registrations
        Map<Constituency, Integer> registrationsByConstituency = this.numberOfRegistrationsByConstituency(party);
        summary.append("Number of registrations per constituency: ").append(registrationsByConstituency).append("\n");

        return summary.toString();
    }

    public String prepareSummary() {
        // Election Summary
        StringBuilder summary = new StringBuilder()
                .append("\nElection summary of \n").append(this.name).append(":\n\n");

        // Parties Total
        int totalParties = this.parties.size();
        summary.append(totalParties).append(" Participating parties: \n");

        // Participating Parties
        List<Party> sortedParties = this.parties.values().stream()
                .sorted(Comparator.comparingInt(Party::getId))
                .collect(Collectors.toList());
        summary.append(sortedParties).append("\n\n");

        // Statistics - Constituencies
        int totalConstituencies = this.constituencies.size();
        summary.append("Total number of constituencies = ").append(totalConstituencies).append("\n");

        // Statistics - Polling Stations
        int totalPollingStations = this.constituencies.stream()
                .mapToInt(constituency -> constituency.getPollingStations().size())
                .sum();
        summary.append("Total number of polling stations = ").append(totalPollingStations).append("\n");

        // Statistics - Candidates
        List<Candidate> allCandidates = this.getAllCandidates();
        int totalCandidates = allCandidates.size();
        summary.append("Total number of candidates in the election = ")
                .append(new DecimalFormat("#,###").format(totalCandidates)).append("\n\n");

        // Duplicate Candidates
        Set<Candidate> candidatesWithDuplicateNames = this.getCandidatesWithDuplicateNames();
        summary.append("Different candidates with duplicate names across different parties are:\n")
                .append(candidatesWithDuplicateNames).append("\n\n");

        // Election Results
        List<Map.Entry<Party, Double>> sortedResults = Election.sortedElectionResultsByPartyPercentage(totalParties,
                getVotesByParty());
        summary.append("Overall election results by party percentage:\n").append(sortedResults).append("\n\n");

        // Polling Stations Wibautstraat
        String rangeA = "1091AA";
        String rangeB = "1091ZZ";
        Collection<PollingStation> pollingStationsByZipCode = this.getPollingStationsByZipCodeRange(rangeA, rangeB);
        summary.append("Polling stations in Amsterdam Wibautstraat area with zip codes ").append(rangeA).append("-")
                .append(rangeB).append(":\n").append(pollingStationsByZipCode).append("\n\n");

        // Election Results Wibautstraat
        int limit = 10;
        List<Map.Entry<Party, Double>> top10Results = Election.sortedElectionResultsByPartyPercentage(limit,
                this.getVotesByPartyAcrossPollingStations(pollingStationsByZipCode));
        summary.append("Top 10 election results by party percentage in Amsterdam Wibautstraat area with zip codes ")
                .append(rangeA).append("-").append(rangeB).append(":\n").append(top10Results).append("\n\n");

        // Most Representative Polling Station
        PollingStation mostRepresentativeStation = this.findMostRepresentativePollingStation();
        limit = 20;
        List<Map.Entry<Party, Double>> representativeResults = Election.sortedElectionResultsByPartyPercentage(limit,
                mostRepresentativeStation.getVotesByParty());
        summary.append("Most representative polling station is:\n").append(mostRepresentativeStation).append("\n\n")
                .append(representativeResults);

        return summary.toString();
    }

    /**
     * Auxiliary method for parsing the data from the EML files
     * This methode can be used as-is and does not require your investigation or
     * extension.
     */
    public void importVotesFromXml(XMLParser parser) throws XMLStreamException {
        if (parser.findBeginTag(Constituency.CONSTITUENCY)) {

            int constituencyId = 0;
            if (parser.findBeginTag(Constituency.CONSTITUENCY_IDENTIFIER)) {
                constituencyId = parser.getIntegerAttributeValue(null, Constituency.ID, 0);
                parser.findAndAcceptEndTag(Constituency.CONSTITUENCY_IDENTIFIER);
            }

            // Constituency constituency = this.constituenciesM.get(constituencyId);
            final int finalConstituencyId = constituencyId;
            Constituency constituency = this.constituencies.stream()
                    .filter(c -> c.getId() == finalConstituencyId)
                    .findFirst()
                    .orElse(null);

            // parser.findBeginTag(PollingStation.POLLING_STATION_VOTES);
            while (parser.findBeginTag(PollingStation.POLLING_STATION_VOTES)) {
                PollingStation pollingStation = PollingStation.importFromXml(parser, constituency, this.parties);
                if (pollingStation != null)
                    constituency.add(pollingStation);
            }

            parser.findAndAcceptEndTag(Constituency.CONSTITUENCY);
        }
    }
}
