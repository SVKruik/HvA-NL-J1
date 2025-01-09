package nl.hva.ict.ads.elections.models;

import nl.hva.ict.ads.utils.PathUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CustomTest {
    private Election election;

    @BeforeEach
    public void setup() throws XMLStreamException, IOException {
        // Loading Election Data
        this.election = Election.importFromDataFolder(PathUtils.getResourcePath("/EML_bestanden_TK2021_HvA_UvA"));
    }

    @Test
    public void duplicateCandidates() {
        // Setup + Sort
        List<Candidate> duplicateCandidates = new ArrayList<>(this.election.getCandidatesWithDuplicateNames());
        duplicateCandidates.sort(Comparator.comparing(Candidate::getFullName));

        // Test
        assertFalse(duplicateCandidates.isEmpty(), "Election does contain duplicate candidate names.");
        assertEquals(duplicateCandidates.get(0).getFullName(), duplicateCandidates.get(1).getFullName(), "Duplicate candidate name should equal sibling.");
        assertNotEquals(duplicateCandidates.get(0).getParty(), duplicateCandidates.get(1).getParty(), "Duplicate candidate party should not equal sibling.");
    }

    @Test
    public void zipCode() {
        // Setup
        String zipCodeA = "1785KM";
        String zipCodeB = "1785K3";
        ZipCode zipCode = new ZipCode();

        // Test
        assertFalse(zipCode.isInvalidZipCode(zipCodeA));
        assertTrue(zipCode.isInvalidZipCode(zipCodeB));
    }

    @Test
    void testPollingStationsByZipCodeRange() {
        // Setup
        String startZipCode = "1091AA";
        String endZipCode = "1091ZZ";
        Collection<PollingStation> pollingStations = election.getPollingStationsByZipCodeRange(startZipCode, endZipCode);

        // Test
        assertTrue(pollingStations.stream()
                        .allMatch(pollingStation -> pollingStation.getName().contains("Amsterdam")),
                "Polling stations should contain correct city name.");
    }
}
