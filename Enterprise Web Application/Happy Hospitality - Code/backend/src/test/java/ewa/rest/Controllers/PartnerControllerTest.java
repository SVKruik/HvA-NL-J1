package ewa.rest.Controllers;

import ewa.rest.Models.Partner;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Partner Tests – Controller
 *
 * @author Emir Bay
 */

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PartnerControllerTest {
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

        // Before running the tests, there is already one partner instance
        Partner partner = new Partner(1, "Emir Bay", "Emir Inc", "Emir.bay@hva.nl", "12345678", "Chain partner", "Wachtwoord123", LocalDate.now());
        testRequestController.doTestRequest(testRestTemplate, Partner.class, "/partners/save", HttpMethod.POST, partner);
    }

    @Test
    public void controllerBaseRoute() {
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, String.class, "/partners/", HttpMethod.GET, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Entity Routes - Partner", response.getBody());
    }

    @Test
    public void retrieveAllPartners() {
        // Retrieve all existing partners with /all end-point
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, Partner[].class, "/partners/all", HttpMethod.GET, null);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Check if there's an existing partner
        Partner[] partners = (Partner[]) response.getBody();
        assertNotNull(partners);
        assertThat(partners.length, is(greaterThan(0)));
    }

    @Test
    public void savePartner() {
        // Post new partner instance with /save end-point
        Partner partner = new Partner(2, "Stefan Kruik", "Stefan Inc", "Stefan.kruik@hva.nl", "87654321", "Knowledge partner", "Stefan123", LocalDate.now());
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, Partner.class, "/partners/save", HttpMethod.POST, partner);

        // Check status code for posting a partner
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Post partner with kvk length greater than 8
        Partner partner2 = new Partner(3, "Tommy Shelby", "Tom Inc", "Tom@hotmail.com", "123456789", "Knowledge partner", "Tom123", LocalDate.now());
        ResponseEntity response2 = testRequestController.doTestRequest(testRestTemplate, Partner.class, "/partners/save", HttpMethod.POST, partner2);

        // Check status code for posting partner with invalid attribute
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response2.getStatusCode());

        // Retrieve all partners after posting a new partner instance
        ResponseEntity responseAll = testRequestController.doTestRequest(testRestTemplate, Partner[].class, "/partners/all", HttpMethod.GET, null);

        // Check the length of partner after posting a partner instance
        Partner[] partners = (Partner[]) responseAll.getBody();
        assertThat(partners.length, is(equalTo(2)));
    }

    @Test
    public void retrievePartnerProfile() {
        // Retrieve the partner with ID 1, which is in this case Emir Bay
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, Partner.class, "/partners/findById/1", HttpMethod.GET, null);
        Partner partner = (Partner) response.getBody();

        // Check if the body matches with the actual partner
        assertEquals("Emir Bay", partner.getName());
        assertEquals("Emir Inc", partner.getCompanyName());
    }
}
