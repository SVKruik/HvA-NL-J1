package ewa.rest.Controllers;

import ewa.rest.Models.NewsArticle;
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

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * News Tests – Controller
 *
 * @author Jenelle Davelaar
 */

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class NewsControllerTest {
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
    public void controllerBaseRoute() {
        //Uses testRequestController to fake a HTTP request
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, String.class, "/news/", HttpMethod.GET, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Entity Routes - News", response.getBody());
    }

    @Test
    public void retrieveAllNews() {
        //Uses testRequestController to fake a HTTP request
        ResponseEntity responseAll = testRequestController.doTestRequest(testRestTemplate, NewsArticle[].class, "/news/allNews", HttpMethod.GET, null);
        assertEquals(HttpStatus.OK, responseAll.getStatusCode());

        NewsArticle[] news = (NewsArticle[]) responseAll.getBody();
        assertNotNull(news);
        //Array should be empty, no news articles were created
        assertThat(news.length, is(equalTo(0)));
    }

    @Test
    public void retrieveAllTypes() {
        ResponseEntity responseChallenges = testRequestController.doTestRequest(testRestTemplate, NewsArticle[].class, "/news/challenges", HttpMethod.GET, null);
        assertEquals(HttpStatus.OK, responseChallenges.getStatusCode());

        ResponseEntity responseResearch = testRequestController.doTestRequest(testRestTemplate, NewsArticle[].class, "/news/research", HttpMethod.GET, null);
        assertEquals(HttpStatus.OK, responseResearch.getStatusCode());

        ResponseEntity responseNetworking = testRequestController.doTestRequest(testRestTemplate, NewsArticle[].class, "/news/networking", HttpMethod.GET, null);
        assertEquals(HttpStatus.OK, responseNetworking.getStatusCode());

        NewsArticle[] challenges = (NewsArticle[]) responseChallenges.getBody();
        NewsArticle[] research = (NewsArticle[]) responseResearch.getBody();
        NewsArticle[] networking = (NewsArticle[]) responseNetworking.getBody();

        assertNotNull(challenges);
        assertNotNull(research);
        assertNotNull(networking);

        assertThat(challenges.length, is(equalTo(0)));
        assertThat(research.length, is(equalTo(0)));
        assertThat(networking.length, is(equalTo(0)));

    }
}