package nl.hva.ict.ads.elections.models;

import nl.hva.ict.ads.utils.xml.XMLParser;

import javax.xml.stream.XMLStreamException;
import java.util.*;

/**
 * A party that participates in the elections
 * Every party is identified by a unique Id
 * Every party maintains a list of Candidates for the election
 * All candidates have a unique (full) name within their party
 * A party shall register (some of) its candidates into one or more Constituencies for participation.
 * Different, ranked Candidate lists may be registered into different constituencies.
 * Votes can be collected by Candidate and by Party across all Constituencies
 */
public class Party {

    public static final String PARTY = "Affiliation";
    public static final String PARTY_IDENTIFIER = "AffiliationIdentifier";
    public static final String ID = "Id";
    public static final String INVALID_NAME = "INVALID";
    private static final String REGISTERED_NAME = "RegisteredName";
    private final int id;
    private final String name;
    /**
     * tracks the candidates of this party
     * Candidates have a unique (full) name within the party.
     * But there may be different Candidates with the same name across different Parties.
     */
    private final Set<Candidate> candidates;

    public Party(int id, String name) {
        this.id = id;
        this.name = name;
        this.candidates = new HashSet<>();
    }

    /**
     * Auxiliary method for parsing the data from the EML files
     * This methode can be used as-is and does not require your investigation or extension.
     */
    public static Party importFromXML(XMLParser parser, Constituency constituency, Map<Integer, Party> parties) throws XMLStreamException {
        if (parser.findBeginTag(PARTY)) {
            int id = 0;
            String name = INVALID_NAME;
            if (parser.findBeginTag(PARTY_IDENTIFIER)) {
                id = parser.getIntegerAttributeValue(null, ID, 0);
                if (parser.findBeginTag(REGISTERED_NAME)) {
                    name = parser.getElementText();
                }
                parser.findAndAcceptEndTag(REGISTERED_NAME);
                parser.findAndAcceptEndTag(PARTY_IDENTIFIER);
            }

            // work around effective final constraint of global variables in lambda expression
            final String partyName = name;
            Party party = parties.computeIfAbsent(id, (i) -> new Party(i, partyName));
            if (!partyName.equals(party.getName())) {
                System.out.printf("Inconsistent names '%s' and '%s' used for party with id=%d\n",
                        partyName, party.getName(), id);
            }

            parser.findBeginTag(Candidate.CANDIDATE);
            while (parser.getLocalName().equals(Candidate.CANDIDATE)) {
                // parse the candidate entry from the Xml file
                Candidate.importFromXml(parser, constituency, party);
            }

            parser.findAndAcceptEndTag(PARTY);
            return party;
        }
        return new Party(-1, INVALID_NAME);
    }

    /**
     * Adds a newCandidate to the set of candidates in the party
     * If a candidate with the same name already had been registered in the party earlier,
     * then this duplicate instance shall be retrieved from the set and returned for further use
     * thereby avoiding the memory footprint of continued use of all duplicate instances of candidates
     * as they are imported from XML
     *
     * @param newCandidate
     * @return the existing duplicate instance of newCandidate if available,
     * or otherwise the newCandidate itself
     */
    public Candidate addOrGetCandidate(Candidate newCandidate) {
        newCandidate.setParty(this);

        Optional<Candidate> existingCandidate = this.getCandidates().stream()
                .filter(candidate -> candidate.equals(newCandidate))
                .findFirst();

        if (existingCandidate.isPresent()) {
            return existingCandidate.get();
        } else {
            this.getCandidates().add(newCandidate);
            return newCandidate;
        }
    }

    @Override
    public String toString() {
        return "Party{" +
                "id=" + id +
                ",name='" + name + "'" +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Party party)) return false;
        return getId() == party.getId() && Objects.equals(getName(), party.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getName(), this.id);
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<Candidate> getCandidates() {
        return candidates;
    }
}
