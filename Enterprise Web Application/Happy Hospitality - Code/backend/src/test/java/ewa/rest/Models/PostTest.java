package ewa.rest.Models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Post Tests – Model
 *
 * @author Milou Hogendoorn
 */

@ActiveProfiles("test")
public class PostTest {

    Post post;

    @BeforeEach
    void setup() {
        //Creating a new post with all attributes from the model
        post = new Post();
        post.setAuthor("HHC");
        post.setContent("Energy and more");
        post.setDate(new Date());
        post.setTitle("Energy");
        post.setVerified(false);
        post.setMain_ticket("123YR123");
        post.setSub_ticket("123AB123");
        post.setLarge_ticket("123MH123");
        post.setSecond_content("Challenges and more");
        post.setSub_ticket_title("Challenges");
        post.setCreation(new Date());
    }

    @Test
    void eventPropertiesAreSetCorrectly() {
        assertEquals("HHC", post.getAuthor());
        assertEquals("Energy and more", post.getContent());
        assertNotNull(post.getDate());
        assertEquals("Energy", post.getTitle());
        assertFalse(post.getVerified());
        assertEquals("123YR123", post.getMain_ticket());
        assertEquals("123AB123", post.getSub_ticket());
        assertEquals("123MH123", post.getLarge_ticket());
        assertEquals("Challenges and more", post.getSecond_content());
        assertEquals("Challenges", post.getSub_ticket_title());
        assertNotNull(post.getCreation());
    }
}
