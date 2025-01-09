package models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;

public class TrafficTrackerTest2 {
    private final static String VAULT_NAME = "/2023-09";

    TrafficTracker trafficTracker;
    List<Violation> topViolationsByCar;
    List<Violation> topViolationsByCity;

    int limit = 5;

    @BeforeEach
    public void setup() {
        Locale.setDefault(Locale.ENGLISH);
        trafficTracker = new TrafficTracker();
        trafficTracker.importCarsFromVault(VAULT_NAME + "/cars.txt");
        trafficTracker.importDetectionsFromVault(VAULT_NAME + "/detections");

        // Setup
        this.topViolationsByCar = trafficTracker.topViolationsByCar(this.limit);
        this.topViolationsByCity = trafficTracker.topViolationsByCity(this.limit);
    }

    @Test
    public void topViolationsByCar() {
        // Setup
        Violation top1 = topViolationsByCar.get(0);

        // Assertions
        assertTrue(this.limit <= topViolationsByCar.size(), "Top violations should atleast be smaller than the limit.");
        assertNotEquals(topViolationsByCar.get(0), topViolationsByCar.get(1), "First and second place should differ.");
        assertTrue(topViolationsByCar.get(0).getOffencesCount() > topViolationsByCar.get(1).getOffencesCount(),
                "First place must have higher offences than second place.");
        Collections.reverse(this.topViolationsByCar);
        assertEquals(top1, this.topViolationsByCar.get(this.topViolationsByCar.size() - 1), "First item should be the last item of reversed list.");
    }

    @Test
    public void topViolationsByCity() {
        // Setup
        Violation top1 = topViolationsByCity.get(0);

        // Assertions
        assertTrue(this.limit <= topViolationsByCity.size(), "Top violations should at least be smaller than the limit.");
        assertNotEquals(topViolationsByCity.get(0), topViolationsByCity.get(1), "First and second place should differ.");
        assertTrue(topViolationsByCity.get(0).getOffencesCount() > topViolationsByCity.get(1).getOffencesCount(),
                "First place must have higher offences than second place.");
        Collections.reverse(this.topViolationsByCity);
        assertEquals(top1, this.topViolationsByCity.get(this.topViolationsByCity.size() - 1), "First item should be the last item of reversed list.");
    }

    @Test
    public void calculateTotalFines() {
        double truckFee = 25.0;
        double coachFee = 35.0;
        double totalMethodFee = this.trafficTracker.calculateTotalFines();

        // Get Total Manually
        int trucks = (this.trafficTracker.getViolations().stream()
                .map(Violation::getCar)
                .filter(car -> car.getCarType() == Car.CarType.Truck)
                .toList()).size();
        int coaches = (this.trafficTracker.getViolations().stream()
                .map(Violation::getCar)
                .filter(car -> car.getCarType() == Car.CarType.Coach)
                .toList()).size();

        double totalManualFee = (trucks * truckFee) + (coaches * coachFee);
        assertEquals(totalManualFee, totalMethodFee, "Total fine price should equal aggregated method and manual calculation.");
    }
}
