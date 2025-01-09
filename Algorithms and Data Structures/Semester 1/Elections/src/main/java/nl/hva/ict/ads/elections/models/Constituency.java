package nl.hva.ict.ads.elections.models;

import nl.hva.ict.ads.utils.xml.XMLParser;

import javax.xml.stream.XMLStreamException;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * A Constituency (kieskring) is a regional district (of multiple cities and villages).
 * Every Constituency has a unique Id
 * Parties have to register their candidates at every Constituency where they want to be electable.
 * Within each Constituency each candidate is uniquely identified by a rank in its party.
 * That is his/her position on the ballot list
 * A party may register different candidates in different constituencies
 * and also allocate a different rank to the same candidate across different constituencies.
 * Within a Constituency you find a number of PollingStations where the voting takes place.
 * Every polling station in the Constituency will use the same ballot list of parties and candidates
 * (Different Constituencies may have different ballot lists)
 * Polling stations are organised by zip code and id such that
 * Navigable SubSets of PollingStations within a range of zipcodes can be retrieved efficiently.
 * Votes can be collected by Candidate and by Party across all polling stations.
 */
public class Constituency {

    public static final String CONSTITUENCY = "Contest";
    public static final String CONSTITUENCY_IDENTIFIER = "ContestIdentifier";
    public static final String ID = "Id";
    public static final String INVALID_NAME = "INVALID";
    protected static final Logger LOG = Logger.getLogger(Constituency.class.getName());
    protected static final String CONSTITUENCY_NAME = "ContestName";
    private final int id;
    private final String name;
    // All candidates that have been registered at this constituency organised by party and rank
    private final Map<Party, NavigableMap<Integer, Candidate>> rankedCandidatesByParty;
    // The polling stations in this constituency organised by zipCode and id
    // such that Navigable Subsets of polling stations within a range of zipcodes can be retrieved efficiently.
    private final NavigableSet<PollingStation> pollingStations;

    public Constituency(int id, String name) {
        this.id = id;
        this.name = name;
        this.rankedCandidatesByParty = new HashMap<>();
        this.pollingStations = new TreeSet<>(Comparator.comparing(PollingStation::getZipCode)
                .thenComparing(PollingStation::getId));
    }

    /**
     * Auxiliary method for parsing the data from the EML files
     * This method can be used as-is and does not require your investigation or extension.
     */
    public static Constituency importFromXML(XMLParser parser, Map<Integer, Party> parties) throws XMLStreamException {
        if (parser.findBeginTag(CONSTITUENCY)) {

            int id = 0;
            String name = null;
            if (parser.findBeginTag(CONSTITUENCY_IDENTIFIER)) {
                id = parser.getIntegerAttributeValue(null, ID, 0);
                if (parser.findBeginTag(CONSTITUENCY_NAME)) {
                    name = parser.getElementText();
                    parser.findAndAcceptEndTag(CONSTITUENCY_NAME);
                }
                parser.findAndAcceptEndTag(CONSTITUENCY_IDENTIFIER);
            }

            Constituency constituency = new Constituency(id, name);
            parser.findBeginTag(Party.PARTY);
            while (parser.getLocalName().equals(Party.PARTY)) {
                Party.importFromXML(parser, constituency, parties);
            }

            if (parser.findAndAcceptEndTag(CONSTITUENCY)) {
                return constituency;
            } else {
                LOG.warning("Can't find " + CONSTITUENCY + " closing tag.");
            }
        } else {
            LOG.warning("Can't find " + CONSTITUENCY + " opening tag.");
        }
        return new Constituency(-1, INVALID_NAME);
    }

    /**
     * registers a candidate for participation in the election for his/her party in this constituency.
     * The given rank indicates the position on the ballot list.
     * If the rank is already taken by another Candidate, this registration shall fail and return false.
     * If the given candidate has been registered already at another rank, this registration shall also fail and return false
     * Used by XML import
     *
     * @param candidate
     * @return whether the registration has succeeded
     */
    public boolean register(int rank, Candidate candidate) {
        // Other Candidates of Party
        NavigableMap<Integer, Candidate> partyCandidates = this.rankedCandidatesByParty.computeIfAbsent(candidate.getParty(), key -> new TreeMap<>());

        // Taken
        if (partyCandidates.containsKey(rank) || partyCandidates.containsValue(candidate)) return false;

        partyCandidates.put(rank, candidate);
        return true;
    }

    /**
     * Retrieves the collection of parties that have registered one or more candidates at this constituency.
     *
     * @return the collection of parties that have registered one or more candidates at this constituency.
     */
    public Collection<Party> getParties() {
        return this.rankedCandidatesByParty.keySet();
    }

    /**
     * Retrieves a candidate from the ballot list of given party and at given rank.
     *
     * @param party
     * @param rank
     * @return
     */
    public Candidate getCandidate(Party party, int rank) {
        NavigableMap<Integer, Candidate> candidatesByRank = this.getCandidatesByRank(party);
        return candidatesByRank != null ? candidatesByRank.get(rank) : null;
    }

    /**
     * retrieve a list of all registered candidates for a given party in order of their rank
     *
     * @param party
     * @return
     */
    public final List<Candidate> getCandidates(Party party) {
        NavigableMap<Integer, Candidate> candidatesByRank = this.getCandidatesByRank(party);
        return candidatesByRank != null ? new ArrayList<>(candidatesByRank.values()) : Collections.emptyList();
    }

    /**
     * Retrieve a map of all
     *
     * @param party
     * @return
     */
    private NavigableMap<Integer, Candidate> getCandidatesByRank(Party party) {
        return this.rankedCandidatesByParty.get(party);
    }

    /**
     * finds all candidates who are electable in this Constituency
     * (via the list of candidates of a party that has been registered).
     *
     * @return the set of all candidates in this Constituency.
     */
    public Set<Candidate> getAllCandidates() {
        return this.rankedCandidatesByParty.values().stream()
                .flatMap(map -> map.values().stream())
                .collect(Collectors.toSet());
    }

    /**
     * Retrieve the sub set of polling stations that are located within the area of the specified zip codes
     * i.e. firstZipCode <= pollingStation.zipCode <= lastZipCode
     * All valid zip codes adhere to the pattern 'nnnnXX' with 1000 <= nnnn <= 9999 and 'AA' <= XX <= 'ZZ'
     *
     * @param firstZipCode
     * @param lastZipCode
     * @return the sub set of polling stations within the specified zipCode range
     */
    public NavigableSet<PollingStation> getPollingStationsByZipCodeRange(String firstZipCode, String lastZipCode) {
        ZipCode zipCode = new ZipCode();
        if (zipCode.isInvalidZipCode(firstZipCode) || zipCode.isInvalidZipCode(lastZipCode)) return null;
        return this.pollingStations.subSet(
                new PollingStation(String.valueOf(this.id), firstZipCode, this.name), true,
                new PollingStation(String.valueOf(this.id), lastZipCode, this.name), true);
    }

    /**
     * Provides a map of total number of votes per party in this constituency
     * accumulated across all polling stations and all candidates
     *
     * @return
     */
    public Map<Party, Integer> getVotesByParty() {
        return this.pollingStations.stream()
                .flatMap(station -> station.getVotesByParty().entrySet().stream())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, Integer::sum));
    }

    /**
     * adds a polling station to this constituency
     *
     * @param pollingStation
     */
    public boolean add(PollingStation pollingStation) {
        if (!this.pollingStations.add(pollingStation)) {
            PollingStation existing = this.pollingStations.floor(pollingStation);
            // Merge existing votes
            if (existing != null) pollingStation.combineVotesWith(existing);
        }
        return true;
    }

    @Override
    public String toString() {
        return "Constituency{" +
                "id=" + id +
                ",name='" + name + "'" +
                "}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Constituency other)) return false;
        return this.id == other.id;
    }

    @Override
    public int hashCode() {
        return this.id;
    }

    public int getId() {
        return id;
    }

    public NavigableSet<PollingStation> getPollingStations() {
        return this.pollingStations;
    }
}
