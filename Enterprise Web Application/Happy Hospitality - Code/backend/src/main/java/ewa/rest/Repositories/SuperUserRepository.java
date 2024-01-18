package ewa.rest.Repositories;

import ewa.rest.Models.SuperUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Repository
public interface SuperUserRepository extends JpaRepository<SuperUser, Long> {
    SuperUser findByEmail(String email);

    @Transactional
    @Modifying
    @Query(value = "UPDATE SuperUser SET isAdmin = ?1 WHERE email = ?2")
    void updateRank(Boolean value, String email);

    @Transactional
    @Modifying
    @Query(value = "UPDATE super_user SET password = :password WHERE email = :email", nativeQuery = true)
    void updatePassword(
            @Param("password") String password,
            @Param("email") String email);

    @Transactional
    @Modifying
    @Query(value = "UPDATE super_user SET blocked = CASE WHEN blocked = false THEN true WHEN blocked = true THEN false ELSE blocked END WHERE email = ?1", nativeQuery = true)
    void toggleBlockSuperUser(String email);

    @Query(value = "SELECT 'event' AS table_name, COUNT(*) AS count, 1 as id FROM event UNION ALL SELECT 'post', COUNT(*) AS count, 2 AS id FROM post UNION ALL SELECT 'entrepreneur', COUNT(*) AS count, 3 AS id FROM entrepreneur UNION ALL SELECT 'partner', COUNT(*) AS count, 4 AS id FROM partner", nativeQuery = true)
    Object[] mainStatistics();

    @Query(value = "SELECT WEEK(date) AS week, COUNT(*) AS count FROM post GROUP BY WEEK(date)", nativeQuery = true)
    Object[] getPostChartData();

    @Query(value = "SELECT WEEK(creation) AS week, COUNT(*) AS count FROM event GROUP BY WEEK(creation)", nativeQuery = true)
    Object[] getEventChartData();

    @Query(value = "SELECT WEEK(creation) AS week, COUNT(*) AS count FROM partner GROUP BY WEEK(creation)", nativeQuery = true)
    Object[] getPartnerChartData();

    @Query(value = "SELECT WEEK(creation) AS week, COUNT(*) AS count FROM entrepreneur GROUP BY WEEK(creation)", nativeQuery = true)
    Object[] getEntrepreneurChartData();

    @Query(value = "CALL cumulative_content()", nativeQuery = true)
    List<Map<String, Object>> retrieveCumulativeCounts();
}
