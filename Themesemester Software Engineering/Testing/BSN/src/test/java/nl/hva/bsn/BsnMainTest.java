package nl.hva.bsn;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

class BsnMainTest {
    BsnMain bsnMain;
    String input;

    @BeforeEach
    void setUp() {
        bsnMain = new BsnMain();
    }

    /**
     * Test the length of the BSN.
     */
    @Test
    void bsnLengthTest() {
        assertEquals(BsnValidationMessage.LENGTH, bsnMain.validate("1234567"));
        assertEquals(BsnValidationMessage.LENGTH, bsnMain.validate("1234567890"));
    }

    /**
     * Test the checksum of the BSN.
     * The checksum is calculated using the eleven proof.
     */
    @Test
    void bsnChecksumTest() {
        assertEquals(BsnValidationMessage.VALID, bsnMain.validate("440015078"));
        assertEquals(BsnValidationMessage.VALID, bsnMain.validate("739029915"));
        assertEquals(BsnValidationMessage.VALID, bsnMain.validate("965188176"));

        assertEquals(BsnValidationMessage.INVALID_CHECKSUM, bsnMain.validate("12345678"));
        assertEquals(BsnValidationMessage.INVALID_CHECKSUM, bsnMain.validate("123456789"));
        assertEquals(BsnValidationMessage.INVALID_CHECKSUM, bsnMain.validate("741949821"));
    }

    /**
     * Test for invalid characters in the BSN.
     */
    @Test
    void bsnInvalidCharactersTest() {
        assertEquals(BsnValidationMessage.INVALID_CHARACTERS, bsnMain.validate("12345A789"));
        assertEquals(BsnValidationMessage.INVALID_CHARACTERS, bsnMain.validate("12345 789"));
    }

    /**
     * Test for empty input.
     */
    @Test
    void bsnEmptyInputTest() {
        assertEquals(BsnValidationMessage.EMPTY_INPUT, bsnMain.validate(""));
        assertEquals(BsnValidationMessage.EMPTY_INPUT, bsnMain.validate(" "));
        assertEquals(BsnValidationMessage.EMPTY_INPUT, bsnMain.validate(null));
    }

    /**
     * Test that the program exits when the user types 'exit'.
     */
    @Test
    void bsnMainInputExitTest() {
        input = "exit\n";

        // Input
        ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
        System.setIn(in);

        // Output
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));

        // Run
        BsnMain.main(new String[0]);
        String output = out.toString();
        assertTrue(output.contains("Exiting..."));
    }

    /**
     * Test that the program marks valid input as correct.
     */
    @Test
    void bsnMainInputValidTest() {
        // Valid checksum
        input = "440015078\nexit\n";

        // Input
        ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
        System.setIn(in);

        // Output
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));

        // Run
        BsnMain.main(new String[0]);
        String output = out.toString();
        assertTrue(output.contains("Valid BSN."));
    }

    /**
     * Test that the program marks invalid input as incorrect.
     */
    @Test
    void bsnMainInputInValidTest() {
        // Invalid checksum
        input = "741949821\nexit\n";

        // Input
        ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
        System.setIn(in);

        // Output
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));

        // Run
        BsnMain.main(new String[0]);
        String output = out.toString();
        assertTrue(output.contains("Invalid BSN. Error: " + BsnValidationMessage.INVALID_CHECKSUM));
    }
}