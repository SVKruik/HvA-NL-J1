package ewa.rest.Controllers;


import ewa.rest.Models.EventAttendee;
import ewa.rest.Repositories.EventAttendeeRepository;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/eventAttendees")
public class EventAttendeeController {

    Logger logger;
    @Autowired
    private EventAttendeeRepository eventAttendeeRepository;

    // Default Route
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - Event Attendee", HttpStatus.OK);
    }

    // Get All For Event ID
    @GetMapping(value = "/getByEventId/{id}")
    public ResponseEntity<ArrayList<EventAttendee>> getByEventId(@PathVariable Integer id) {
        return new ResponseEntity<>(eventAttendeeRepository.getByEventId(id), HttpStatus.OK);
    }

    // Get By Identifier
    @GetMapping(value = "/getByIdentifier/{identifier}")
    public ResponseEntity<ArrayList<EventAttendee>> getByIdentifier(@PathVariable String identifier) {
        try {
            ArrayList<EventAttendee> eventAttendees = eventAttendeeRepository.getEventAttendeeByIdentifier(identifier);
            if (!eventAttendees.isEmpty()) {
                return new ResponseEntity<>(eventAttendees, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get All Emails
    @GetMapping(value = "/emails")
    public ResponseEntity<String[]> getAllEmails() {
        return new ResponseEntity<>(eventAttendeeRepository.getAllEmails(), HttpStatus.OK);
    }

    // Get All Emails By Event ID
    @GetMapping(value = "/emails/event/{id}")
    public ResponseEntity<String[]> getAllEmailsEvent(@PathVariable Long id) {
        return new ResponseEntity<>(eventAttendeeRepository.getAllEmailsEvent(id), HttpStatus.OK);
    }

    // Delete All By Event ID
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id) {
        eventAttendeeRepository.deleteByEventId(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Delete Selected Event
    @DeleteMapping(value = "/delete/{id}/{identifier}")
    public ResponseEntity<HttpStatus> deleteSelectedEvent(@PathVariable Long id, @PathVariable String identifier) {
        try {
            eventAttendeeRepository.deleteByIdentifier(id, identifier);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Error deleting event attendee: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/save")
    public ResponseEntity<EventAttendee> saveEventAttendee(@RequestBody EventAttendee eventAttendee) {
        try {
            eventAttendeeRepository.saveEventAttendee(eventAttendee.getEventId(), eventAttendee.getIdentifier(), eventAttendee.getStatus());
            return new ResponseEntity<>(eventAttendee, HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
