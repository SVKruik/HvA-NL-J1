package ewa.rest.Repositories;

import ewa.rest.Models.PostTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, Long> {
    @Query(value = "SELECT tag.name, tag.id FROM tag LEFT JOIN post_tag ON post_tag.tag_id = tag.id LEFT JOIN post ON post.id = post_tag.post_id WHERE post.id = ?1", nativeQuery = true)
    String[] allPostTags(long postId);
}
