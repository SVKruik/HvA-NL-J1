package ewa.rest.Repositories;

import ewa.rest.Models.NewsletterSubscribers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface NewsletterSubscribersRepository extends JpaRepository<NewsletterSubscribers, Long> {

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO newsletter_subscribers (email) VALUES (:email);", nativeQuery = true)
    void save(
            @Param("email") String email
    );
}
