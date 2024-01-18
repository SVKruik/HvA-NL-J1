package ewa.rest.Controllers;

import ewa.rest.Models.Event;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Event Tests – Controller
 * @author Stijn Kortekaas
 */

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class EventControllerTest {
    private final TestRequestController testRequestController = new TestRequestController();
    @Autowired
    private TestRestTemplate testRestTemplate;
    @Value("${server.servlet.context-path}")
    private String servletContextPath;
    private long id;

    @BeforeEach
    void setup() {
        if (servletContextPath == null) {
            servletContextPath = "/";
        }

        Event event = new Event("Event test", "ABCDEFGH", "12345678", "Sub image title", "Description for event", "Second description for event", new Date(2022, 9, 9), 10.0, new Date(), "Challenge");
        testRequestController.doTestRequest(testRestTemplate, Event.class, "/events/save", HttpMethod.POST, event);
    }

    @Test
    public void controllerBaseRoute() {
        //Fake a HTTP request to the event controller and check this action
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, String.class, "/events/", HttpMethod.GET, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Entity Routes - Event", response.getBody());
    }

    @Test
    public void retrieveEventById() {
        //Fake a HTTP request to the event controller with the id of the event we created in the setup
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, Event.class, "/events/findById/1", HttpMethod.GET, null);

        // check if the response body is not null
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

    }






}
