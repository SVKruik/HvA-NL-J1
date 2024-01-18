package ewa.rest.Models;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Entrepreneur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private Long age;

    @Column
    private String gender;

    @Column
    private String address;

    @Column
    private String postalCode;

    @Column
    private String companyName;

    @Column
    private String companyFunction;

    @Column
    private String industry;

    @Column(nullable = false)
    private LocalDate creation;

    @ManyToOne
    @JoinColumn(name = "partner_id")
    private Partner partner;

    @Column
    private Boolean blocked;

    public Entrepreneur(String name, String companyName, String email, String password, LocalDate creation) {
        this.name = name;
        this.companyName = companyName;
        this.email = email;
        this.password = password;
        this.creation = creation;
    }

    public Entrepreneur(long id, String name, String companyName, String email, String password, LocalDate creation) {
        this.id = id;
        this.name = name;
        this.companyName = companyName;
        this.email = email;
        this.password = password;
        this.creation = creation;
    }
    public Entrepreneur() {}

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getCompanyFunction() {
        return companyFunction;
    }

    public void setCompanyFunction(String companyFunction) {
        this.companyFunction = companyFunction;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public LocalDate getCreation() {
        return creation;
    }

    public void setCreation(LocalDate creation) {
        this.creation = creation;
    }

    public Partner getPartner() {
        return partner;
    }

    public void setPartner(Partner partner) {
        this.partner = partner;
    }
}
