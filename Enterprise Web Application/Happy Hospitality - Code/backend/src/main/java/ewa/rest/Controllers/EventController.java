package ewa.rest.Controllers;

import ewa.rest.Models.Event;
import ewa.rest.Repositories.EventAttendeeRepository;
import ewa.rest.Repositories.EventRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventAttendeeRepository eventAttendeeRepository;

    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - Event", HttpStatus.OK);
    }

    // Upcoming Events
    @GetMapping(value = "/upcoming/{limit}")
    public ResponseEntity<ArrayList<Event>> findUpcoming(@PathVariable Integer limit) {
        ArrayList<Event> upcomingEvents = eventRepository.findUpcoming(limit);
        return new ResponseEntity<>(upcomingEvents, HttpStatus.OK);
    }

    // Previous Events
    @GetMapping(value = "/previous/{limit}")
    public ResponseEntity<List<Event>> findPrevious(@PathVariable Integer limit) {
        return new ResponseEntity<>(eventRepository.findPrevious(limit), HttpStatus.OK);
    }

    // Get By ID
    @GetMapping(value = "/findById/{id}")
    public ResponseEntity<Event> findById(@PathVariable Long id) {
        try {
            Event event = eventRepository.findById(id).orElse(null);
            if (event != null) {
                return new ResponseEntity<>(event, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get events by identifier
    @GetMapping(value = "/findByIdentifier/{identifier}")
    public ResponseEntity<ArrayList<Event>> findUpcoming(@PathVariable String identifier) {
        ArrayList<Event> eventsUser = eventRepository.findProfileByIdentifier(identifier);
        return new ResponseEntity<>(eventsUser, HttpStatus.OK);
    }

    // Create New
    @PostMapping(value = "/save")
    public ResponseEntity<Event> saveEvent(@RequestBody Event event) {
        try {
            eventRepository.save(event);
            return new ResponseEntity<>(event, HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete By ID
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<HttpStatus> deleteEvent(@PathVariable Long id) throws MessagingException {
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            String[] eventAttendees = eventAttendeeRepository.getAllEmailsEvent(id);
            if (eventAttendees.length > 0) {
                MailController mailController = new MailController();
                mailController.eventDelete(eventAttendees, String.format("""
                        Wij willen u ervan op de hoogte stellen dat het evenement waar u zich voor heeft aangemeld, helaas geannuleerd is.</br></br>
                        U krijgt het bedrag voor de aanmelding binnen 5 werkdagen volledig teruggestort.</br></br>
                        Het gaat om het volgende evenement:
                        <ul><li>Naam: <strong>%s</strong></li><li>Bedrag: <strong>€%s</strong></li><li>Datum: <strong>%s</strong></li></ul></br></br>
                        Onze excuses voor het ongemak.""", event.getTitle(), new DecimalFormat("#,##").format(event.getPrice()), this.dateFormatter(event.getDate())));
            }
            eventRepository.deleteById(id);
            eventAttendeeRepository.deleteByEventId(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Format the input date to readable output.
     *
     * @param date The input date to be formatted.
     * @return The readable output date.
     */
    public String dateFormatter(Date date) {
        String pattern = "dd-MM-yyyy HH:mm";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        return simpleDateFormat.format(date);
    }

    // Filtered Events
    @GetMapping(value = "/filtered")
    public ResponseEntity<List<Event>> findFiltered(@RequestParam String month, @RequestParam List<String> types) {
        if (!types.isEmpty()) {
            return new ResponseEntity<>(eventRepository.findFilteredFull(month, types.get(0)), HttpStatus.OK);
        } else return new ResponseEntity<>(eventRepository.findFilteredMonth(month), HttpStatus.OK);
    }
}
