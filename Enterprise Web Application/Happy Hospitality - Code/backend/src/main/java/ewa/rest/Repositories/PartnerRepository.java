package ewa.rest.Repositories;

import ewa.rest.Models.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, Long> {
    Optional<Partner> findByEmail(String email);

    @Query(value = "SELECT p.* FROM partner p WHERE p.company_name = :companyName AND p.name = :name", nativeQuery = true)
    Optional<Partner> findProfile(
            @Param("companyName") String companyName,
            @Param("name") String name
    );

    @Transactional
    @Modifying
    @Query(value = "UPDATE partner SET address = :address, age = :age, company_function = :companyFunction, company_name = :companyName, gender = :gender, industry = :industry, name = :name, postal_code = :postalCode, kvk = :kvk, tag = :tag WHERE email = :email", nativeQuery = true)
    void updatePartnerData(
            @Param("address") String address,
            @Param("age") Long age,
            @Param("companyFunction") String companyFunction,
            @Param("companyName") String companyName,
            @Param("gender") String gender,
            @Param("industry") String industry,
            @Param("name") String name,
            @Param("postalCode") String postalCode,
            @Param("kvk") String kvk,
            @Param("tag") String tag,
            @Param("email") String email
    );

    @Transactional
    @Modifying
    @Query(value = "UPDATE partner SET password = :password WHERE email = :email", nativeQuery = true)
    void updatePassword(
            @Param("password") String password,
            @Param("email") String email);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO partner (name, email, company_name, password, creation, blocked) VALUES (:name, :email, :companyName, :password, :creation, :blocked);", nativeQuery = true)
    void save(
            @Param("name") String name,
            @Param("email") String email,
            @Param("companyName") String companyName,
            @Param("password") String password,
            @Param("creation") String creation,
            @Param("blocked") String blocked

    );

    @Transactional
    @Modifying
    @Query(value = "UPDATE partner SET blocked = CASE WHEN blocked = 0 THEN 1 WHEN blocked = 1 THEN 0 ELSE blocked END WHERE id = ?1", nativeQuery = true)
    void toggleBlockPartner(Long id);
}
