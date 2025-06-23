package tse.cicd.Controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * ApiControllerTest
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ApiControllerTest {
    private final TestRestTemplate testRestTemplate = new TestRestTemplate();

    @LocalServerPort
    private int port;

    @Value("${server.servlet.context-path}")
    private String servletContextPath;
    private String baseUrl;

    @BeforeEach
    void setup() {
        if (this.servletContextPath == null) {
            this.servletContextPath = "/";
        }
        this.baseUrl = "http://localhost:" + this.port + this.servletContextPath;
    }

    @Test
    public void testHomePage() {
        ResponseEntity<String> response = this.testRestTemplate.getForEntity(this.baseUrl, String.class);
        assertEquals("Stefan Kruik - TSE - BSN Validator", response.getBody());
    }
}
