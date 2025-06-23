package tse.cicd.Controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * BSNControllerTest
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class BSNControllerTest {
    private final TestRestTemplate testRestTemplate = new TestRestTemplate();

    @LocalServerPort
    private int port;

    @Value("${server.servlet.context-path}")
    private String servletContextPath;
    private String baseUrl;
    private String testBsn;

    @BeforeEach
    void setup() {
        if (this.servletContextPath == null) {
            this.servletContextPath = "/";
        }
        this.baseUrl = "http://localhost:" + this.port + this.servletContextPath + "/bsn/validate";
    }

    @Test
    public void bsnLengthTest() {
        // Shorter than 8 characters
        this.testBsn = "1234567";
        ResponseEntity<String> response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn,
                String.class);
        assertEquals("\"LENGTH\"", response.getBody());
        assertEquals(HttpStatusCode.valueOf(400), response.getStatusCode());

        // Longer than 9 characters
        this.testBsn = "1234567890";
        response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn, String.class);
        assertEquals("\"LENGTH\"", response.getBody());
    }

    @Test
    public void bsnChecksumTest() {
        // Valid BSNs
        this.testBsn = "440015078";
        ResponseEntity<String> response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn,
                String.class);
        assertEquals("\"VALID\"", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        this.testBsn = "739029915";
        response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn, String.class);
        assertEquals("\"VALID\"", response.getBody());

        this.testBsn = "965188176";
        response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn, String.class);
        assertEquals("\"VALID\"", response.getBody());

        // Invalid BSNs
        this.testBsn = "12345678";
        response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn, String.class);
        assertEquals("\"INVALID_CHECKSUM\"", response.getBody());
        assertEquals(HttpStatusCode.valueOf(400), response.getStatusCode());

        this.testBsn = "123456789";
        response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn, String.class);
        assertEquals("\"INVALID_CHECKSUM\"", response.getBody());

        this.testBsn = "741949821";
        response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn, String.class);
        assertEquals("\"INVALID_CHECKSUM\"", response.getBody());
    }

    @Test
    public void bsnInvalidCharactersTest() {
        // Invalid characters
        this.testBsn = "12345A789";
        ResponseEntity<String> response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn,
                String.class);
        assertEquals("\"INVALID_CHARACTERS\"", response.getBody());
        assertEquals(HttpStatusCode.valueOf(400), response.getStatusCode());

        // Space character
        this.testBsn = "12345 789";
        response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn, String.class);
        assertEquals("\"INVALID_CHARACTERS\"", response.getBody());
    }

    @Test
    public void bsnEmptyInputTest() {
        // Empty input
        this.testBsn = "";
        ResponseEntity<String> response = this.testRestTemplate.getForEntity(this.baseUrl + "/" + this.testBsn,
                String.class);
        assertEquals(HttpStatusCode.valueOf(404), response.getStatusCode());
    }
}
