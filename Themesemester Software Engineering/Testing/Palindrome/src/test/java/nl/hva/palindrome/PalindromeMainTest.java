package nl.hva.palindrome;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

public class PalindromeMainTest {
    private static final PalindromeMain palindromeMain = new PalindromeMain();

    @BeforeEach
    void setUp() {
        palindromeMain.clearPalindromes();
    }

    @Test
    void testPalindromeInput() {
        assertTrue(palindromeMain.isPalindrome("racecar"));
    }

    @Test
    void testNonPalindromeInput() {
        assertFalse(palindromeMain.isPalindrome("hello"));
    }

    @Test
    void testPalindromeInputPersists() {
        palindromeMain.isPalindrome("racecar");
        ArrayList<String> palindromes = palindromeMain.getPalindromes();
        assertEquals(1, palindromes.size());
        assertEquals("racecar", palindromes.get(0));
    }

    @Test
    void testExitInput() {
        assertFalse(palindromeMain.inputHandler("exit"));
    }
}