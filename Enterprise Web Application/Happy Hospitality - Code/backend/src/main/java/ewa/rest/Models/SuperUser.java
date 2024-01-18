package ewa.rest.Models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class SuperUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean isAdmin;

    @Column
    private Date creation;

    @Column
    private int createdById;

    @Column
    private boolean blocked;

    public SuperUser() {
    }

    public SuperUser(long id, String email, boolean isAdmin) {
        this.id = id;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    public SuperUser(String email, boolean isAdmin, int createdById) {
        this.email = email;
        this.isAdmin = isAdmin;
        this.createdById = createdById;
    }

    public SuperUser(String name, String email, String password, boolean isAdmin, Date creation, boolean blocked) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.creation = creation;
        this.blocked = blocked;
    }

    public SuperUser newSuperUser(String email, boolean isAdmin) {
        return new SuperUser(email, isAdmin, (int) this.getId());
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

    public int getCreatedById() {
        return createdById;
    }

    public void setCreatedById(int createdById) {
        this.createdById = createdById;
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

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public Date getCreation() {
        return creation;
    }

    public void setCreation(Date creation) {
        this.creation = creation;
    }

    @Override
    public String toString() {
        return "SuperUser{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", isAdmin=" + isAdmin +
                ", creation=" + creation +
                ", createdById=" + createdById +
                ", blocked=" + blocked +
                '}';
    }
}
