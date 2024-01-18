package ewa.rest.Models;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String address;

    @Column
    private String industry;

    @Column
    private String postalCode;

    @Column
    private String companyName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String companyFunction;

    @Column(nullable = true, unique = true, length = 8)
    private String kvk;

    @Column
    private String tag;

    @Column(nullable = false)
    private String password;

    @Column
    private Long age;

    @Column
    private String gender;

    @Column(nullable = false)
    private LocalDate creation;

    @Column
    private Boolean blocked;

    public Partner(String name, String companyName, String email, String kvk, String tag, String password, LocalDate creation) {
        this.name = name;
        this.companyName = companyName;
        this.email = email;
        this.kvk = kvk;
        this.tag = tag;
        this.password = password;
        this.creation = creation;
    }

    public Partner(long id, String name, String companyName, String email, String kvk, String tag, String password, LocalDate creation) {
        this.id = id;
        this.name = name;
        this.companyName = companyName;
        this.email = email;
        this.kvk = kvk;
        this.tag = tag;
        this.password = password;
        this.creation = creation;
    }

    public Partner() {
    }

    public Boolean getBlocked() {
        return blocked;
    }

    public void setBlocked(Boolean blocked) {
        this.blocked = blocked;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyFunction() {
        return companyFunction;
    }

    public void setCompanyFunction(String companyFunction) {
        this.companyFunction = companyFunction;
    }

    public String getKvk() {
        return kvk;
    }

    public void setKvk(String kvk) {
        this.kvk = kvk;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getAge() {
        return age;
    }

    public void setAge(Long age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getCreation() {
        return creation;
    }

    public void setCreation(LocalDate creation) {
        this.creation = creation;
    }
}
