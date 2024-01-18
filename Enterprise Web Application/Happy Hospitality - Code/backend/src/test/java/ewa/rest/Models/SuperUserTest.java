package ewa.rest.Models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

/**
 * Super User Tests – Model
 *
 * @author Stefan Kruik
 */

@ActiveProfiles("test")
class SuperUserTest {

    SuperUser superUser1, superUser2;

    @BeforeEach
    void setup() {
        this.superUser1 = new SuperUser(1, "stefan.kruik@hva.nl", true);
        this.superUser2 = new SuperUser(2, "emir.bay@hva.nl", false);
    }

    @Test
    void whenCreatingNewSuperUserValuesAreCorrect() {
        // Perform basic constructor test.
        assertEquals(this.superUser1.getId(), 1);
        assertEquals(this.superUser2.getId(), 2);
    }

    @Test
    void whenCreatingNewSuperUserAsParentChildHasCorrectCreatedById() {
        // Create new child Super User.
        SuperUser superUser3 = this.superUser1.newSuperUser("example@example.com", false);

        // Check for correct values.
        assertFalse(superUser3.isAdmin());
        assertEquals(superUser3.getCreatedById(), this.superUser1.getId());
    }
}
