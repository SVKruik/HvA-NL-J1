package ewa.rest.Repositories;

import ewa.rest.Models.EventAttendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Repository
public interface EventAttendeeRepository extends JpaRepository<EventAttendee, Long> {
    @Query(value = "SELECT * FROM event_attendee WHERE event_id = ?1", nativeQuery = true)
    ArrayList<EventAttendee> getByEventId(Integer id);

    ArrayList<EventAttendee> getEventAttendeeByIdentifier(String identifier);

    @Query(value = "SELECT DISTINCT identifier FROM event_attendee", nativeQuery = true)
    String[] getAllEmails();

    @Query(value = "SELECT DISTINCT identifier FROM event_attendee WHERE event_id = ?1", nativeQuery = true)
    String[] getAllEmailsEvent(Long id);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM event_attendee WHERE event_id = ?1", nativeQuery = true)
    void deleteByEventId(Long id);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM event_attendee WHERE event_id = :id AND identifier = :identifier", nativeQuery = true)
    void deleteByIdentifier(Long id, String identifier);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO event_attendee (event_id, identifier, status) VALUES (:event_id, :identifier, :status)", nativeQuery = true)
    void saveEventAttendee(Long event_id, String identifier, String status);
}
