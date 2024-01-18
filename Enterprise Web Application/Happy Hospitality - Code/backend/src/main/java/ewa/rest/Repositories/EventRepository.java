package ewa.rest.Repositories;

import ewa.rest.Models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // All upcoming events, previous events excluded. Capped by custom value.
    @Query(value = "SELECT * FROM event WHERE date > CURRENT_DATE ORDER BY date LIMIT ?1", nativeQuery = true)
    ArrayList<Event> findUpcoming(Integer limit);

    // All previous events, upcoming events excluded. Capped by custom value.
    @Query(value = "SELECT * FROM event WHERE date >= CURRENT_DATE - INTERVAL ?1 MONTH AND date < CURRENT_DATE ORDER BY date", nativeQuery = true)
    ArrayList<Event> findPrevious(Integer months);

    @Query(value = "SELECT event.* FROM event_attendee INNER JOIN event ON event.id = event_attendee.event_id WHERE event_attendee.identifier = :identifier", nativeQuery = true)
    ArrayList<Event> findProfileByIdentifier(@Param("identifier") String identifier);


    // save date to events table in database
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO event (title, description, second_description, price, date, creation, ticket, sub_ticket, type, sub_ticket_title) VALUES (:title, :description, :second_description, :price, :date, :creation, :ticket, :sub_ticket, :type, :sub_ticket_title)", nativeQuery = true)
    void save(String title, String description, String second_description, Double price, String date, String creation, String ticket, String sub_ticket, String type, String sub_ticket_title);

    @Query(value = "SELECT 200")
    Integer checkDatabase();

    @Query(value = "SELECT * FROM event WHERE YEAR(date) = SUBSTRING(?1, 1, 4) AND MONTH(date) = SUBSTRING(?1, 6, 7)", nativeQuery = true)
    List<Event> findFilteredMonth(String month);

    @Query(value = "SELECT event.* FROM event LEFT JOIN event_type ON event_type.event_id = event.id LEFT JOIN type ON type.id = event_type.type_id WHERE YEAR(date) = SUBSTRING(?1, 1, 4) AND MONTH(date) = SUBSTRING(?1, 6, 7) AND type.name = ?2", nativeQuery = true)
    List<Event> findFilteredFull(String month, String type);
}
