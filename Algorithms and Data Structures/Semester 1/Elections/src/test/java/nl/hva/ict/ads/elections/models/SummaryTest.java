package nl.hva.ict.ads.elections.models;

import nl.hva.ict.ads.utils.PathUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.*;

public class SummaryTest {
    int randomPartyId;
    private Election election;

    @BeforeEach
    public void setup() throws XMLStreamException, IOException {
        // Loading Election Data
        this.election = Election.importFromDataFolder(PathUtils.getResourcePath("/EML_bestanden_TK2021_HvA_UvA"));
        // this.election = Election.importFromDataFolder(PathUtils.getResourcePath("/EML_bestanden_TK2021"));

        this.randomPartyId = 1 + (int) Math.floor(Math.random() * election.getParties().size());
    }

    @Test
    public void partySummary() {
        // Setup
        Party party = this.election.getParty(this.randomPartyId);
        String partySummary = this.election.prepareSummary(this.randomPartyId);

        // Test
        assertNotNull(party, "Valid party should be picked.");
        assertTrue(partySummary.contains(party.toString()), "Summary should contain the toString representation of the party.");
        assertTrue(partySummary.contains("Candidates: [Candidate{partyId=" + randomPartyId), "Specified candidates should have the same partyId.");
    }

    @Test
    public void partyErrorSummary() {
        // Setup
        String invalidSummary = this.election.prepareSummary(50505);

        // Test
        assertNull(invalidSummary);
    }

    @Test
    public void electionSummary() {
        // Setup
        String electionSummary = this.election.prepareSummary();

        // Manual Candidate Count
        int totalCandidates = 0;
        // Iterator is more fun than enhanced for-loop.
        Iterator<Party> partyIterator = this.election.getParties().iterator();
        while (partyIterator.hasNext()) {
            Party iteratorParty = partyIterator.next();
            totalCandidates += iteratorParty.getCandidates().size();
        }
        String formattedTotalCandidates = new DecimalFormat("#,###").format(totalCandidates);

        // Test
        assertEquals(this.election.getAllCandidates().size(), totalCandidates, "Total amount of candidates calculations should equal.");
        assertTrue(electionSummary.contains(this.election.getParties().size() + " Participating parties:"), "Summary should contain the amount of participating parties.");
        assertTrue(electionSummary.contains(formattedTotalCandidates), "Summary should contain the total amount of participating candidates.");
    }
}
