package ewa.rest.Models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Event Tests – Model
 * @author Stijn Kortekaas
 */

@ActiveProfiles("test")
public class EventTest {

    Event event;

    @BeforeEach
    void setup() {
        this.event = new Event("Event test", "ABCDEFGH", "12345678", "Sub image title", "Description for event", "Second description for event", new Date(), 10.0, new Date(), "Challenge");
    }

    @Test
    void constructorTest() {
        assertEquals(this.event.getTitle(), "Event test");
    }
}
