package ewa.rest.Repositories;


import ewa.rest.Models.Event;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * Event Tests – Repository
 * @author Stijn Kortekaas
 */

@DataJpaTest
@ActiveProfiles("test")
public class EventRepositoryTest {
    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private EventRepository eventRepository;

    private List<Event> events;

    @BeforeEach
    public void setup() {

        this.events = new ArrayList<>();

        Event event1 = new Event("Event test", "ABCDEFGH", "12345678", "Sub image title", "Description for event", "Second description for event", new Date(), 10.0, new Date(), "Challenge");
        entityManager.persist(event1);

        Event event2 = new Event("Event test 2", "PLFTYRHD", "73985121", "Sub image title 2", "Description for event 2", "Second description for event 2", new Date(), 20.0, new Date(), "Presentatie");
        entityManager.persist(event2);

        this.events = this.eventRepository.findAll();
        System.out.println(this.events);
    }

    @Test
    public void repoGetAllEvents() {
        // checks if the events have been added correctly
        Assertions.assertEquals(this.events.size(), 2);
    }

    @Test
    public void repoGetEventsByPrice() {
        int totalEvents = 0;

        // adds all the events with a price higher than 15.0 to the totalEvents variable (should be 1)
        for (Event event : this.events) {
            if (event.getPrice()  > 15.0) {
                totalEvents++;
            }
        }

        Assertions.assertEquals(totalEvents, 1);
    }

    @Test
    public void repoGetCorrectEventsBeforeAndAfter() {

        int eventsBeforeUpdate = this.events.size();

        // adds a 3rd event
        Event event3 = new Event("Event test 3", "PLFTYFHD", "73485121", "Sub image title 3", "Description for event 3", "Second description for event 3", new Date(), 25.0, new Date(), "Presentatie");
        entityManager.persist(event3);

        // updates the events variable (should be 3)
        this.events = this.eventRepository.findAll();

        int eventsAfterUpdate = this.events.size();

        System.out.println(eventsAfterUpdate);
        System.out.println(eventsBeforeUpdate);

        Assertions.assertEquals(eventsBeforeUpdate, 2);
        Assertions.assertEquals(eventsAfterUpdate, 3);
    }




}


