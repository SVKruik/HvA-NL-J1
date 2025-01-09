package spotifycharts;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Comparator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * This class tests the stability of sorting mechanisms in the Song class.
 */
public class SongStabilityTest {
    private static Comparator<Song> rankingSchemeTotal, rankingSchemeDutchNational;
    private Song song1, song2, song3;

    /**
     * Sets up the ranking schemes used for testing before any tests run.
     */
    @BeforeAll
    static void setupClass() {
        rankingSchemeTotal = Song::compareByHighestStreamsCountTotal;
        rankingSchemeDutchNational = Song::compareForDutchNationalChart;
    }

    /**
     * Initializes some sample Song objects before each test is executed.
     */
    @BeforeEach
    void setup() {
        song1 = new Song("Travis Scott", "FE!N", Song.Language.EN);
        song1.setStreamsCountOfCountry(Song.Country.NL, 50);
        song2 = new Song("The Kid LAROI", "Bleed", Song.Language.NL);
        song2.setStreamsCountOfCountry(Song.Country.NL, 50);
        song3 = new Song("Lewis Capaldi", "Forever", Song.Language.EN);
        song3.setStreamsCountOfCountry(Song.Country.UK, 100);
    }

    /**
     * Tests if a song is compared with itself, the comparison result is zero.
     */
    @Test
    void compareSameSong() {
        assertEquals(0, rankingSchemeTotal.compare(song1, song1));
        assertEquals(0, rankingSchemeDutchNational.compare(song2, song2));
    }

    /**
     * Tests the reversibility of the comparison. The result should be negated
     * when the order of songs is reversed.
     */
    @Test
    void compareReversibility() {
        assertEquals(-rankingSchemeTotal.compare(song1, song2), rankingSchemeTotal.compare(song2, song1));
        assertEquals(-rankingSchemeDutchNational.compare(song2, song3), rankingSchemeDutchNational.compare(song3, song2));
    }

    /**
     * Tests the comparison between different songs for the total streams count ranking scheme.
     */
    @Test
    void compareDifferentSongsTotal() {
        assertTrue(rankingSchemeTotal.compare(song1, song3) > 0);
        assertTrue(rankingSchemeTotal.compare(song3, song2) < 0);
    }

    /**
     * Tests the comparison between different songs for the Dutch national chart ranking scheme.
     */
    @Test
    void compareDifferentSongsDutchNational() {
        assertTrue(rankingSchemeDutchNational.compare(song2, song1) < 0);
        assertTrue(rankingSchemeDutchNational.compare(song1, song3) > 0);
    }

    // Additional defect-based tests

    /**
     * Tests how negative stream counts are handled in comparison.
     */
    @Test
    void incorrectStreamCounts() {
        song1.setStreamsCountOfCountry(Song.Country.NL, -100);
        assertTrue(rankingSchemeTotal.compare(song1, song2) > 0, "Song with negative streams count incorrectly ranked higher.");
    }

    /**
     * Tests the language-based comparison logic, specifically for Dutch songs.
     */
    @Test
    void languageComparisonIssue() {
        assertTrue(rankingSchemeDutchNational.compare(song2, song1) < 0, "Dutch song not ranked correctly in Dutch chart.");
    }
}