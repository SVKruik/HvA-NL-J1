package ewa.rest.Repositories;

import ewa.rest.Models.Entrepreneur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface EntrepreneurRepository extends JpaRepository<Entrepreneur, Long> {
    Optional<Entrepreneur> findByEmail(String email);

    @Query(value = "SELECT e.* FROM entrepreneur e WHERE e.company_name = :companyName AND e.name = :name", nativeQuery = true)
    Optional<Entrepreneur> findProfile(
            @Param("companyName") String companyName,
            @Param("name") String name);

    @Transactional
    @Modifying
    @Query(value = "UPDATE entrepreneur SET address = :address, age = :age, company_function = :companyFunction, company_name = :companyName, gender = :gender, industry = :industry, name = :name, postal_code = :postalCode WHERE email = :email", nativeQuery = true)
    void updateEntrepreneurData(
            @Param("address") String address,
            @Param("age") Long age,
            @Param("companyFunction") String companyFunction,
            @Param("companyName") String companyName,
            @Param("gender") String gender,
            @Param("industry") String industry,
            @Param("name") String name,
            @Param("postalCode") String postalCode,
            @Param("email") String email);

    @Transactional
    @Modifying
    @Query(value = "UPDATE entrepreneur SET password = :password WHERE email = :email", nativeQuery = true)
    void updatePassword(
            @Param("password") String password,
            @Param("email") String email);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO entrepreneur (name, email, company_name, password, creation, blocked) VALUES (:name, :email, :companyName, :password, :creation, :blocked);", nativeQuery = true)
    void save(
            @Param("name") String name,
            @Param("email") String email,
            @Param("companyName") String companyName,
            @Param("password") String password,
            @Param("creation") String creation,
            @Param("blocked") String blocked);

    @Transactional
    @Modifying
    @Query(value = "UPDATE entrepreneur SET blocked = CASE WHEN blocked = 0 THEN 1 WHEN blocked = 1 THEN 0 ELSE blocked END WHERE id = ?1", nativeQuery = true)
    void toggleBlockEntrepreneur(Long id);
}
