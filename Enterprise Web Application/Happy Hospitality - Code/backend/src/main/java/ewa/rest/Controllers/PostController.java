package ewa.rest.Controllers;

import ewa.rest.Models.Post;
import ewa.rest.Repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/posts")
public class PostController {
    @Autowired
    private PostRepository postRepository;

    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - Post", HttpStatus.OK);
    }

    // Get All
    @GetMapping(value = "/all")
    public ResponseEntity<List<Post>> getPartners() {
        return new ResponseEntity<>(postRepository.findAll(), HttpStatus.OK);
    }

    // Get By ID
    @GetMapping(value = "/findById/{id}")
    public ResponseEntity<Post> findById(@PathVariable Long id) {
        try {
            Post post = postRepository.findById(id).orElse(null);
            if (post != null) {
                return new ResponseEntity<>(post, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create New
    @PostMapping(value = "/save")
    public ResponseEntity<Post> savePost(@RequestBody Post post) {
        try {
            postRepository.save(post);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update Specific
    @GetMapping(value = "/update/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody Post post) {
        try {
            Post targetPost = postRepository.findById(id).orElse(null);
            if (targetPost != null) {
                targetPost.setVerified(post.getVerified());
                targetPost.setTitle(post.getTitle());
                targetPost.setContent(post.getContent());
                targetPost.setAuthor(post.getAuthor());
                return new ResponseEntity<>(HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete Specific
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        try {
            Post targetPost = postRepository.findById(id).orElse(null);
            if (targetPost != null) {
                postRepository.delete(targetPost);
                return new ResponseEntity<>(HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // (Un)Verify Specific
    @PutMapping(value = "/toggleVerify/{id}")
    public ResponseEntity<HttpStatus> updateRank(@PathVariable Long id) {
        try {
            postRepository.toggleVerify(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Recent Related
    @GetMapping(value = "/related/{theme}")
    public ResponseEntity<ArrayList<Post>> findRecentRelated(@PathVariable String theme) {
        try {
            return new ResponseEntity<>(postRepository.findRecentRelated(theme), HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Post Overview Theme Filter
    @GetMapping(value = "/postOverview/{theme}")
    public ResponseEntity<ArrayList<Post>> postOverviewTheme(@PathVariable String theme) {
        try {
            return new ResponseEntity<>(postRepository.findByTheme(theme), HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Post Full Filter
    @GetMapping(value = "/postOverview")
    public ResponseEntity<List<Post>> postOverviewFilter(@RequestParam(required = false) String theme, @RequestParam(required = false) String date) {
        try {
            if (Objects.equals(theme, "all_themes")) theme = "%";
            if (theme != null && date != null) {
                return new ResponseEntity<>(postRepository.findFilteredFull(theme, date), HttpStatus.OK);
            } else if (theme != null) {
                return new ResponseEntity<>(postRepository.findFilteredTheme(theme), HttpStatus.OK);
            } else if (date != null) {
                return new ResponseEntity<>(postRepository.findFilteredDate(date), HttpStatus.OK);
            } else return new ResponseEntity<>(postRepository.findAll(), HttpStatus.OK);
        } catch (Exception exception) {
            System.out.println("--- Error: " + exception.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
