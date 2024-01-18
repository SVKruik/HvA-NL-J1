package ewa.rest.Models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * News Tests – Model
 *
 * @author Jenelle Davelaar
 */

@ActiveProfiles("test")
public class NewsArticleTest {

    NewsArticle newsArticle;

    @BeforeEach
    void setup() {
        //Create challenge article (all possible attributes)
        newsArticle = new NewsArticle();
        newsArticle.setTitle("News article test");
        newsArticle.setTicket("MAIN123");
        newsArticle.setSub_ticket("SUB123");
        newsArticle.setSub_ticket_title("Sub image title");
        newsArticle.setLarge_ticket("LARGE123");
        newsArticle.setDescription("Description for news article");
        newsArticle.setSecond_description("Second description for news article");
        newsArticle.setDate(new Date());
        newsArticle.setCreation(new Date());
        newsArticle.setType("Challenge");
    }

    @Test
    void eventPropertiesAreSetCorrectly() {
        assertEquals("News article test", newsArticle.getTitle());
        assertEquals("MAIN123", newsArticle.getTicket());
        assertEquals("SUB123", newsArticle.getSub_ticket());
        assertEquals("Sub image title", newsArticle.getSub_ticket_title());
        assertEquals("LARGE123", newsArticle.getLarge_ticket());
        assertEquals("Description for news article", newsArticle.getDescription());
        assertEquals("Second description for news article", newsArticle.getSecond_description());
        assertNotNull(newsArticle.getDate());
        assertNotNull(newsArticle.getCreation());
        assertEquals("Challenge", newsArticle.getType());
    }

}
