package ewa.rest.Models;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true, length = 8)
    private String ticket;

    @Column(unique = true, length = 8)
    private String sub_ticket;

    @Column(unique = true)
    private String sub_ticket_title;

    @Column(unique = true, length = 8)
    private String large_ticket;

    @Column(nullable = false)
    private String description;

    @Column
    private String second_description;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private Date creation;

    @Column(nullable = false)
    private String type;

    public Event() {
    }

    public Event(String title, String ticket, String sub_ticket, String sub_ticket_title, String description, String second_description, Date date, double price, Date creation, String type) {
        this.title = title;
        this.ticket = ticket;
        this.sub_ticket = sub_ticket;
        this.sub_ticket_title = sub_ticket_title;
        this.description = description;
        this.second_description = second_description;
        this.date = date;
        this.price = price;
        this.creation = creation;
        this.type = type;
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Date getCreation() {
        return creation;
    }

    public void setCreation(Date creation) {
        this.creation = creation;
    }

    public String getSub_ticket() {
        return sub_ticket;
    }

    public void setSub_ticket(String sub_ticket) {
        this.sub_ticket = sub_ticket;
    }

    public String getSub_ticket_title() {
        return sub_ticket_title;
    }

    public void setSub_ticket_title(String sub_ticket_title) {
        this.sub_ticket_title = sub_ticket_title;
    }

    public String getSecond_description() {
        return second_description;
    }

    public void setSecond_description(String second_description) {
        this.second_description = second_description;
    }

    public String getLarge_ticket() {
        return large_ticket;
    }

    public void setLarge_ticket(String large_ticket) {
        this.large_ticket = large_ticket;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
