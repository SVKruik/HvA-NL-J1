package ewa.rest.Repositories;

import ewa.rest.Models.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;

public interface NewsRepository extends JpaRepository<NewsArticle, Long> {
    @Query(value = "SELECT * FROM news_article WHERE type = 'challenge' ORDER BY date", nativeQuery = true)
    ArrayList<NewsArticle> findChallenges();

    @Query(value = "SELECT * FROM news_article WHERE type = 'research' ORDER BY date", nativeQuery = true)
    ArrayList<NewsArticle> findResearch();

    @Query(value = "SELECT * FROM news_article WHERE type = 'networking' ORDER BY date", nativeQuery = true)
    ArrayList<NewsArticle> findNetworking();
}