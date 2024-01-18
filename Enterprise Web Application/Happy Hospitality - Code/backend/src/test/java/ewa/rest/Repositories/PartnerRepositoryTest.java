package ewa.rest.Repositories;

import ewa.rest.Models.Partner;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Partner Tests – Repository
 *
 * @author Emir Bay
 */

@DataJpaTest
@ActiveProfiles("test")
public class PartnerRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PartnerRepository partnerRepository;

    private List<Partner> partners;

    @BeforeEach
    public void setup() {
        // Configure partners to test
        this.partners = new ArrayList<>();
        Partner partner = new Partner("Emir Bay", "Emir Inc", "Emir.bay@hva.nl", "12345678", "Chain partner", "Wachtwoord123", LocalDate.now());
        entityManager.persist(partner);
        Partner partner2 = new Partner("Stefan Kruik", "Stefan Inc", "Stefan.kruik@hva.nl", "87654321", "Knowledge partner", "Stefan123", LocalDate.now());
        entityManager.persist(partner2);
        Partner partner3 = new Partner("Tommy Shelby", "Tom Inc", "Tom@hotmail.com", "12345679", "Knowledge partner", "Tom123", LocalDate.now());
        entityManager.persist(partner3);

        this.partners = this.partnerRepository.findAll();
    }

    @Test
    public void repoFindAllReturnsAll() {
        Assertions.assertFalse(this.partners.isEmpty());
    }

    @Test
    public void repoFindAllCompanies() {
        // Retrieve all the companies of the existing partners
        for (Partner value : partners) {
            Optional<Partner> partner = partnerRepository.findById(value.getId());
            assertEquals(value.getCompanyName(), partner.get().getCompanyName());
        }
    }

    @Test
    public void repoFindByEmail() {
        // Find user by email
        Optional<Partner> partner = this.partnerRepository.findByEmail("Emir.bay@hva.nl");
        assertEquals(partner.get().getName(), "Emir Bay");
    }
}
