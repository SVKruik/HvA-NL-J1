package ewa.rest.Models;

public class ChartResponse {
    private final Object[] posts;
    private final Object[] events;
    private final Object[] partners;
    private final Object[] entrepreneurs;

    public ChartResponse(Object[] posts, Object[] events, Object[] partners, Object[] entrepreneurs) {
        this.posts = posts;
        this.events = events;
        this.partners = partners;
        this.entrepreneurs = entrepreneurs;
    }

    public Object[] getEvents() {
        return events;
    }

    public Object[] getPosts() {
        return posts;
    }

    public Object[] getPartners() {
        return partners;
    }

    public Object[] getEntrepreneurs() {
        return entrepreneurs;
    }
}
