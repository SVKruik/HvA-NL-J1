package ewa.rest.Models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private boolean verified;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false, length = 20)
    private String main_ticket;

    @Column(length = 20)
    private String sub_ticket;

    @Column(length = 20)
    private String large_ticket;

    @Column
    private String sub_ticket_title;

    @Column
    private String second_content;

    @Column
    private Date creation;

    public Date getCreation() {
        return creation;
    }

    public void setCreation(Date creation) {
        this.creation = creation;
    }

    public long getId() {
        return id;
    }

    public boolean getVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getMain_ticket() {
        return main_ticket;
    }

    public void setMain_ticket(String mainTicket) {
        this.main_ticket = mainTicket;
    }

    public String getSub_ticket() {
        return sub_ticket;
    }

    public void setSub_ticket(String subTicket) {
        this.sub_ticket = subTicket;
    }

    public String getLarge_ticket() {
        return large_ticket;
    }

    public void setLarge_ticket(String large_ticket) {
        this.large_ticket = large_ticket;
    }

    public String getSub_ticket_title() {
        return sub_ticket_title;
    }

    public void setSub_ticket_title(String sub_ticket_title) {
        this.sub_ticket_title = sub_ticket_title;
    }

    public String getSecond_content() {
        return second_content;
    }

    public void setSecond_content(String second_content) {
        this.second_content = second_content;
    }
}
