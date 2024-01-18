package ewa.rest.Controllers;

import ewa.rest.Models.NewsArticle;
import ewa.rest.Repositories.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {
    @Autowired
    private NewsRepository newsRepository;

    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - News", HttpStatus.OK);
    }

    @GetMapping(value = "/allNews")
    public ResponseEntity<List<NewsArticle>> findAllNews() {
        return new ResponseEntity<>(newsRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/challenges")
    public ResponseEntity<ArrayList<NewsArticle>> findChallenges() {
        ArrayList<NewsArticle> challenges = newsRepository.findChallenges();
        return new ResponseEntity<>(challenges, HttpStatus.OK);
    }

    @GetMapping(value = "/research")
    public ResponseEntity<ArrayList<NewsArticle>> findResearch() {
        ArrayList<NewsArticle> research = newsRepository.findResearch();
        return new ResponseEntity<>(research, HttpStatus.OK);
    }

    @GetMapping(value = "/networking")
    public ResponseEntity<ArrayList<NewsArticle>> findNetworking() {
        ArrayList<NewsArticle> research = newsRepository.findNetworking();
        return new ResponseEntity<>(research, HttpStatus.OK);
    }

    // Get By ID
    @GetMapping(value = "/findById/{id}")
    public ResponseEntity<NewsArticle> findById(@PathVariable Long id) {
        try {
            NewsArticle newsArticle = newsRepository.findById(id).orElse(null);
            if (newsArticle != null) {
                return new ResponseEntity<>(newsArticle, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
