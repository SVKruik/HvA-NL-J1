package ewa.rest.Models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Partner Tests – Model
 *
 * @author Emir Bay
 */

@ActiveProfiles("test")
public class PartnerTest {

    Partner partner1;

    @BeforeEach
    void setup() {
        // Default partner configured
        this.partner1 = new Partner("Emir Bay", "Emir Inc", "Emir.bay@hva.nl", "12345678", "Chain partner", "Wachtwoord123", LocalDate.now());
    }

    @Test
    void constructorTest() {
        assertEquals(this.partner1.getId(), 0);
        assertEquals(this.partner1.getName(), "Emir Bay");
    }

    @Test
    void getBlockedReturnsTrueWhenUserIsBlocked() {
        // Block the user to limit their access to the site
        partner1.setBlocked(true);

        // Assert: Check if getBlocked returns true
        assertTrue(partner1.getBlocked());
    }
}
