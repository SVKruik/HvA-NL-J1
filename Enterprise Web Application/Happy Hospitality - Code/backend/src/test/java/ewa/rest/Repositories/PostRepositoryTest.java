package ewa.rest.Repositories;

import ewa.rest.Models.Post;
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
 * Post Tests – Repository
 *
 * @author Milou Hogendoorn
 */

@DataJpaTest
@ActiveProfiles("test")
public class PostRepositoryTest {

    private static final int expectedNumberOfPosts = 1;
    @Autowired
    private TestEntityManager entityManager;
    @Autowired
    private PostRepository postRepository;
    private List<Post> posts;

    @BeforeEach
    public void setup() {
        this.posts = new ArrayList<>();

        //Sample post with all possible attributes
        Post post = new Post();
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

        //Persist the post tot the database using TestEntityManager
        entityManager.persist(post);

        //Fetching all posts from the repository
        this.posts = this.postRepository.findAll();
    }

    /**
     * Check if all posts can be fetched
     */
    @Test
    public void repoFindAllReturnsAll() {
        //Checks if the posts list is not empty
        Assertions.assertFalse(this.posts.isEmpty());

        //Checks if the number of posts is equal to the expected number of posts
        Assertions.assertEquals(expectedNumberOfPosts, this.posts.size());
    }

    /**
     * Check if a post can be verified
     */
    @Test
    public void repoFindVerifiedPostsReturnsVerified() {
        //Gets the first post from the list
        Post post = this.posts.get(0);

        //Toggle the value (true or false) of verified
        post.setVerified(!post.getVerified());

        //Save the modified post
        postRepository.save(post);

        //Get the post again after the save to check if the repo correctly changed the value
        Post updatedPost = postRepository.findById(post.getId()).orElse(null);

        //Check if the verified value is correctly toggled after the save
        Assertions.assertNotNull(updatedPost);
        Assertions.assertEquals(post.getVerified(), updatedPost.getVerified());
    }
}
