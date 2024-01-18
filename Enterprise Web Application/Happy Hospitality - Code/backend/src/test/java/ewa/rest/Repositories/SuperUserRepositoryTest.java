package ewa.rest.Repositories;

import ewa.rest.Models.SuperUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Super User Tests – Repository
 *
 * @author Stefan Kruik
 */

@DataJpaTest
@ActiveProfiles("test")
public class SuperUserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SuperUserRepository superUserRepository;

    @BeforeEach
    void setup() {
        SuperUser superUser = new SuperUser("Stefan Kruik", "stefan.kruik@hva.nl", "Passwd123", true, new Date(), false);
        entityManager.persist(superUser);
        entityManager.flush();
    }

    @Test
    public void testFindByEmail() {
        // Find and check.
        SuperUser foundUser = superUserRepository.findByEmail("stefan.kruik@hva.nl");
        System.out.println(foundUser.getId());
        assertNotNull(foundUser);
        assertEquals("stefan.kruik@hva.nl", foundUser.getEmail());
    }

    @Test
    public void testFindById() {
        long targetId = superUserRepository.findAll().get(0).getId();

        // Find and check.
        SuperUser foundUser = superUserRepository.findById(targetId).orElse(null);
        assertNotNull(foundUser);
        assertEquals(targetId, foundUser.getId());
    }

    @Test
    public void togglingBlockStateWorksAutomatically() {
        // Initial Loading
        SuperUser superUser = superUserRepository.findAll().get(0);
        assertFalse(superUser.getBlocked());

        // Switching
        superUserRepository.toggleBlockSuperUser(superUser.getEmail());
        entityManager.refresh(superUser);

        // Checking
        assertTrue(superUserRepository.findByEmail(superUser.getEmail()).getBlocked());
    }
}