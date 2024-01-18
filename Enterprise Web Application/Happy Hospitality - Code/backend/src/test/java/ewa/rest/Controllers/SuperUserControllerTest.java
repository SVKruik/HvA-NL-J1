package ewa.rest.Controllers;

import ewa.rest.Models.SuperUser;
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

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Super User Tests – Controller
 *
 * @author Stefan Kruik
 */

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class SuperUserControllerTest {
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
    public void whenFetchingBaseRouteReturnCorrectLocationMessage() {
        // Perform GET Request to specified endpoint.
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, String.class, "/superUsers/", HttpMethod.GET, null);

        // Check response for expected values.
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Entity Routes - Super User", response.getBody());
    }

    @Test
    public void whenFetchingAllReturnCorrectSuperUsers() {
        // Perform GET Request to specified endpoint.
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, SuperUser[].class, "/superUsers/all", HttpMethod.GET, null);

        // Check response for expected values.
        assertEquals(HttpStatus.OK, response.getStatusCode());
        SuperUser[] superUsers = (SuperUser[]) response.getBody();
        assertNotNull(superUsers);
        assertThat(superUsers.length, is(equalTo(0)));
    }

    @Test
    public void ifEmailNotFoundShowsCorrectError() {
        // Perform GET Request to specified endpoint.
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, Number.class, "/superUsers/findByEmail/email@example.com", HttpMethod.GET, null);

        // Expected 404 Not Found when Super User with this email does not exist.
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void ifWrongHttpVerbShowsCorrectError() {
        // Perform erroneous POST Request to specified endpoint.
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, Number.class, "/superUsers", HttpMethod.POST, null);

        // Expected 405 Not Found when using POST (or any other method) instead of GET.
        assertEquals(HttpStatus.METHOD_NOT_ALLOWED, response.getStatusCode());
    }
}
