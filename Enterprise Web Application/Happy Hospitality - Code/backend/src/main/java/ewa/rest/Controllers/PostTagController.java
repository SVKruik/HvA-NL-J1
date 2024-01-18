package ewa.rest.Controllers;

import ewa.rest.Repositories.PostTagRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/postTag")
public class PostTagController {
    @Autowired
    private PostTagRepository postTagRepository;

    // Default
    @GetMapping(value = {"", "/"})
    public ResponseEntity<String> defaultRoute() {
        return new ResponseEntity<>("Entity Routes - Post Tag", HttpStatus.OK);
    }

    // Get all tags for specific post
    @GetMapping(value = "/post/{postId}")
    public ResponseEntity<JSONArray> allPostRoute(@PathVariable long postId) {
        String[] postTags = postTagRepository.allPostTags(postId);
        JSONArray response = new JSONArray();
        for (String tag : postTags) {
            JSONObject tagJson = new JSONObject();
            String[] parts = tag.split(",");
            tagJson.put("id", Integer.parseInt(parts[1]));
            tagJson.put("name", parts[0]);
            response.add(tagJson);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
