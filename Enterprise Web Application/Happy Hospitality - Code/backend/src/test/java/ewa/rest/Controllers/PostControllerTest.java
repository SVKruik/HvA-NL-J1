package ewa.rest.Controllers;

import ewa.rest.Models.Post;
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
 * Post Tests – Controller
 *
 * @author Milou Hogendoorn
 */

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PostControllerTest {

    //Controller to manipulate the HTTP requests
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

    /**
     * Test to check the basis route of the post controller
     */
    @Test
    public void controllerBaseRoute() {
        //Fake a HTTP request to posts and check this action
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, String.class, "/posts/", HttpMethod.GET, null);

        //Assert that the statuscode is OK en if the body matches with the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Entity Routes - Post", response.getBody());
    }

    /**
     * Test for fetching all posts
     */
    @Test
    public void retrieveAllPosts() {
        //Fake a HTTP request to all posts and check this response
        ResponseEntity response = testRequestController.doTestRequest(testRestTemplate, Post[].class, "/posts/all", HttpMethod.GET, null);

        //Assert that the statuscode is OK
        assertEquals(HttpStatus.OK, response.getStatusCode());

        //Fetch the array with all posts from the response
        Post[] posts = (Post[]) response.getBody();

        //Assert that the array is not null
        assertNotNull(posts);
        //The array should be empty becayse there are no new posts created
        assertThat(posts.length, is(equalTo(0)));
    }
}
