package ewa.rest.Repositories;

import ewa.rest.Models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Posts posted within one month ago.
    @Query(value = "SELECT post.* FROM post LEFT JOIN post_tag ON post_tag.post_id = post.id LEFT JOIN tag ON post_tag.tag_id = tag.id WHERE tag.name = ?1 AND date >= CURRENT_DATE - INTERVAL 2 MONTH", nativeQuery = true)
    ArrayList<Post> findRecentRelated(String theme);

    @Transactional
    @Modifying
    @Query(value = "UPDATE post SET verified = CASE WHEN verified = 0 THEN 1 WHEN verified = 1 THEN 0 ELSE verified END WHERE id = ?1", nativeQuery = true)
    void toggleVerify(Long id);

    @Query(value = "SELECT post.* FROM post LEFT JOIN post_tag ON post_tag.post_id = post.id LEFT JOIN tag ON post_tag.tag_id = tag.id WHERE tag.name = ?1", nativeQuery = true)
    ArrayList<Post> findByTheme(String theme);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO post (author, content, second_content, date, title, verified, main_ticket, sub_ticket, sub_ticket_title) VALUES (:author, :content, :second_content, :date, :title, :verified, :main_ticket, :sub_ticket, :sub_ticket_title)", nativeQuery = true)
    void save(String author, String content, String second_content, String date, String title, boolean verified, String main_ticket, String sub_ticket, String sub_ticket_title);

    @Query(value = """
            SELECT post.* FROM post LEFT JOIN post_tag ON post_tag.post_id = post.id LEFT JOIN tag on tag.id = post_tag.tag_id WHERE tag.name LIKE ?1 AND
                        ((?2 = 'week' AND creation >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY))
                        OR (?2 = 'month' AND YEAR(creation) = YEAR(CURDATE()) AND MONTH(creation) = MONTH(CURDATE()))
                        OR (?2 = 'triomonth' AND creation >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH))
                        OR (?2 = 'hexamonth' AND creation >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH))
                        OR ?2 = 'all')""", nativeQuery = true)
    ArrayList<Post> findFilteredFull(String theme, String date);

    @Query(value = "SELECT post.* FROM post LEFT JOIN ewa.post_tag on post.id = post_tag.post_id LEFT JOIN ewa.tag on post_tag.tag_id = tag.id WHERE tag.name LIKE ?1", nativeQuery = true)
    ArrayList<Post> findFilteredTheme(String theme);

    @Query(value = "SELECT post.* FROM post WHERE "
            + "(:date = 'week' AND creation >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY))"
            + " OR (:date = 'month' AND YEAR(creation) = YEAR(CURDATE()) AND MONTH(creation) = MONTH(CURDATE()))"
            + " OR (:date = 'triomonth' AND creation >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH))"
            + " OR (:date = 'hexamonth' AND creation >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH))"
            + " OR :date = 'all'", nativeQuery = true)
    ArrayList<Post> findFilteredDate(String date);
}
