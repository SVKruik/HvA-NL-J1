package ewa.rest.Models;

import java.util.Map;

public class CumulativeChartResponse {
    private final int weekNumber;
    private final int postsCount;
    private final int eventsCount;
    private final int partnersCount;
    private final int entrepreneursCount;

    public CumulativeChartResponse(Map<String, Object> resultMap) {
        this.weekNumber = (int) resultMap.get("weekNumber");
        this.postsCount = ((Number) resultMap.get("posts_count")).intValue();
        this.eventsCount = ((Number) resultMap.get("events_count")).intValue();
        this.partnersCount = ((Number) resultMap.get("partners_count")).intValue();
        this.entrepreneursCount = ((Number) resultMap.get("entrepreneurs_count")).intValue();
    }

    public int getWeekNumber() {
        return weekNumber;
    }

    public int getPostsCount() {
        return postsCount;
    }

    public int getEventsCount() {
        return eventsCount;
    }

    public int getPartnersCount() {
        return partnersCount;
    }

    public int getEntrepreneursCount() {
        return entrepreneursCount;
    }
}
