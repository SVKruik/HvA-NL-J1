
package ewa.rest.Repositories;

        import ewa.rest.Models.Entrepreneur;
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
 * Entrepreneur Tests – Repository
 *
 * @author Mike Schaper
 */

@DataJpaTest
@ActiveProfiles("test")
public class EntrepreneurRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private EntrepreneurRepository entrepreneurRepository;

    private Entrepreneur entrepreneur;

    @BeforeEach
    public void setup() {
        entrepreneur = new Entrepreneur("Mike Schaper", "Flatline Agency", "mike.schaper@hva.nl", "password", LocalDate.now());
        entityManager.persist(entrepreneur);
        entityManager.flush();
    }

    @Test
    public void whenFindByEmailtTenReturnEntrepreneur() {
        Optional<Entrepreneur> found = entrepreneurRepository.findByEmail(entrepreneur.getEmail());
        Assertions.assertTrue(found.isPresent());
        Assertions.assertEquals(entrepreneur.getEmail(), found.get().getEmail());
    }




}
