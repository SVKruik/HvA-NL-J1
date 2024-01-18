package ewa.rest.Controllers;

import ewa.rest.Models.Entrepreneur;
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

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class EntrepreneurControllerTest {
    private final TestRequestController testRequestController = new TestRequestController();
    @Autowired
    private TestRestTemplate testRestTemplate;
    @Value("${server.servlet.context-path}")
    private String servletContextPath;

    @BeforeEach
    void setup() {
        if (servletContextPath == null) {
            servletContextPath = "/";
        }
    }

    @Test
    public void testDefaultRoute() {
        // Perform GET Request to specified endpoint.
        ResponseEntity<String> response = testRequestController.doTestRequest(
                testRestTemplate, String.class, "/entrepreneurs/", HttpMethod.GET, null);

        // Check response for expected values.
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Entity Routes - Entrepreneur", response.getBody());
    }

    @Test
    public void testGetAllEntrepreneurs() {
        ResponseEntity<Entrepreneur[]> response = testRequestController.doTestRequest(
                testRestTemplate, Entrepreneur[].class, "/entrepreneurs/all", HttpMethod.GET, null);

        // Check response for expected values.
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    public void testFindByEmailNotFound() {
        ResponseEntity<Entrepreneur> response = testRequestController.doTestRequest(
                testRestTemplate, Entrepreneur.class, "/entrepreneurs/findByEmail/nonexistent@hva.nl", HttpMethod.GET, null);

        // Check response for expected 404 Not Found.
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testSaveEntrepreneur() {
        Entrepreneur newEntrepreneur = new Entrepreneur("Mike Schaper", "Flatline Agency", "mike.schaper@hva.nl", "password", LocalDate.now());

        // POST to save
        ResponseEntity<String> response = testRequestController.doTestRequest(
                testRestTemplate, String.class, "/entrepreneurs/save", HttpMethod.POST, newEntrepreneur);

        // Check response
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Optionally, you can retrieve the entrepreneur to verify it was saved correctly
        ResponseEntity<Entrepreneur> fetchResponse = testRequestController.doTestRequest(
                testRestTemplate, Entrepreneur.class, "/entrepreneurs/findByEmail/mike.schaper@hva.nl", HttpMethod.GET, null);

        assertEquals(HttpStatus.OK, fetchResponse.getStatusCode());
        assertEquals("Mike Schaper", fetchResponse.getBody().getName());
    }

}
