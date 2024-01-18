package ewa.rest.Models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Entrepreneur Tests – Model
 *
 * @author Mike Schaper
 */

@ActiveProfiles("test")
public class EntrepreneurTest {

    Entrepreneur entrepreneur;

    @BeforeEach
    void setup() {
        // Default partner configured
        this.entrepreneur = new Entrepreneur(1, "Mike Schaper", "Flaltine Agnecy", "mike.schaper@hva.nl",  "password", LocalDate.now());
    }

    @Test
    void constructorTest() {
        assertEquals(this.entrepreneur.getId(), 1);
    }

}

