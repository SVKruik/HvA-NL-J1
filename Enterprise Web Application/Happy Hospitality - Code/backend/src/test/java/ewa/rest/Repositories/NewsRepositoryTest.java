package ewa.rest.Repositories;

import ewa.rest.Models.NewsArticle;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * News Tests – Repository
 *
 * @author Jenelle Davelaar
 */

@DataJpaTest
@ActiveProfiles("test")
public class NewsRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private NewsRepository newsRepository;

    private List<NewsArticle> newsArticles;

    @BeforeEach
    public void setup() {
        this.newsArticles = new ArrayList<>();

        //Create challenge article (all possible attributes)
        NewsArticle newsChallenge = new NewsArticle();
        newsChallenge.setTitle("Challenge news article");
        newsChallenge.setTicket("MAIN123");
        newsChallenge.setSub_ticket("SUB123");
        newsChallenge.setSub_ticket_title("Sub image title challenge");
        newsChallenge.setLarge_ticket("LARGE123");
        newsChallenge.setDescription("Description for challenge");
        newsChallenge.setSecond_description("Second description for challenge");
        newsChallenge.setDate(new Date());
        newsChallenge.setCreation(new Date());
        newsChallenge.setType("challenge");
        entityManager.persist(newsChallenge);

        //Create research article (no large ticket & second description)
        NewsArticle newsResearch = new NewsArticle();
        newsResearch.setTitle("Research news article");
        newsResearch.setTicket("123MAIN");
        newsResearch.setSub_ticket("123SUB");
        newsResearch.setSub_ticket_title("Sub image title research");
        newsResearch.setDescription("Description for research");
        newsResearch.setDate(new Date());
        newsResearch.setCreation(new Date());
        newsResearch.setType("research");
        entityManager.persist(newsResearch);

        //Create networking article (no sub ticket & sub ticket title)
        NewsArticle newsNetworking = new NewsArticle();
        newsNetworking.setTitle("Research news networking");
        newsNetworking.setTicket("456MAIN");
        newsNetworking.setLarge_ticket("456LARGE");
        newsNetworking.setDescription("Description for networking");
        newsNetworking.setSecond_description("Second description for networking");
        newsNetworking.setDate(new Date());
        newsNetworking.setCreation(new Date());
        newsNetworking.setType("networking");
        entityManager.persist(newsNetworking);

        //Fill arraylist with created news articles
        this.newsArticles = this.newsRepository.findAll();
    }

    @Test
    public void repoFindAllReturnsAll() {
        Assertions.assertFalse(this.newsArticles.isEmpty());
    }

    @Test
    public void repoFindChallengesReturnsChallenge() {
        List<NewsArticle> challengeArticles = newsRepository.findChallenges();
        Assertions.assertFalse(challengeArticles.isEmpty(),
                "No challenge articles found.");

        for (NewsArticle challenge : challengeArticles) {
            Assertions.assertEquals("challenge", challenge.getType(),
                    "Found articles are not of the right type: 'challenge'.");
        }
    }

    @Test
    public void repoFindChallengesReturnsResearch() {
        List<NewsArticle> researchArticles = newsRepository.findResearch();
        Assertions.assertFalse(researchArticles.isEmpty(),
                "No research articles found.");

        for (NewsArticle research : researchArticles) {
            Assertions.assertEquals("research", research.getType(),
                    "Found articles are not of the right type: 'research'.");
        }
    }

    @Test
    public void repoFindChallengesReturnsNetworking() {
        List<NewsArticle> networkingArticles = newsRepository.findNetworking();
        Assertions.assertFalse(networkingArticles.isEmpty(),
                "No networking articles found.");

        for (NewsArticle networking : networkingArticles) {
            Assertions.assertEquals("networking", networking.getType(),
                    "Found articles are not of the right type: 'networking'.");
        }
    }

}
