package models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;

public class DetectionTest2 {

    Car scoda, audi, bmw, mercedes, icova, volvo1, volvo2, daf1, daf2, kamaz;
    List<Car> cars;

    List<Detection> detections = new ArrayList<>();

    @BeforeEach
    public void setup() {
        Locale.setDefault(Locale.ENGLISH);

        // Load Cars
        scoda = new Car("1-AAA-02", 6, Car.CarType.Car, Car.FuelType.Gasoline, LocalDate.of(2014, 1, 31));
        audi = new Car("AA-11-BB", 4, Car.CarType.Car, Car.FuelType.Diesel, LocalDate.of(1998, 1, 31));
        mercedes = new Car("VV-11-BB", 4, Car.CarType.Van, Car.FuelType.Diesel, LocalDate.of(1998, 1, 31));
        bmw = new Car("A-123-BB", 4, Car.CarType.Car, Car.FuelType.Gasoline, LocalDate.of(2019, 1, 31));
        icova = new Car("1-TTT-99", 5, Car.CarType.Truck, Car.FuelType.Lpg, LocalDate.of(2011, 1, 31));
        volvo1 = new Car("1-TTT-01", 5, Car.CarType.Truck, Car.FuelType.Diesel, LocalDate.of(2009, 1, 31));
        volvo2 = new Car("1-TTT-02", 6, Car.CarType.Truck, Car.FuelType.Diesel, LocalDate.of(2011, 1, 31));
        daf1 = new Car("1-CCC-01", 5, Car.CarType.Coach, Car.FuelType.Diesel, LocalDate.of(2009, 1, 31));
        daf2 = new Car("1-CCC-02", 6, Car.CarType.Coach, Car.FuelType.Diesel, LocalDate.of(2011, 1, 31));
        kamaz = new Car("1-AAAA-0000", 4, Car.CarType.Coach, Car.FuelType.Diesel, LocalDate.of(1999, 4, 15));
        cars = new ArrayList<>(List.of(scoda, audi, mercedes, bmw, icova, volvo1, volvo2, daf1, daf2, kamaz));

        // Load Detections
        for (Car car : cars) {
            detections.add(new Detection(car, "Den Helder", LocalDateTime.parse("2022-09-24T11:44:26")));
        }
    }

    @Test
    public void validatePurple() {
        assertTrue(true);
        Detection detection1 = this.detections.get(8); // Daf 2 Coach, normal emission.
        Detection detection2 = this.detections.get(9); // Kamaz Coach, high emission.
        Detection detection3 = this.detections.get(0); // Scoda Car, normal emission.
        Detection detection4 = this.detections.get(1); // Scoda Car, high emission.

        // Coach Daf 2
        Violation violation1 = detection1.validatePurple();
        assertNull(violation1, "Coach with emission category 6 should not violate.");

        // Coach Kamaz
        Violation violation2 = detection2.validatePurple();
        assertNotNull(detection2.validatePurple(), "Coach with emission category 4 should violate.");
        assertSame(violation2.getCity(), "Den Helder", "Violation should be created correctly.");

        // Cars
        assertNull(detection3.validatePurple(), "Car with low emission should not violate.");
        assertNull(detection4.validatePurple(), "Car with high emission should not violate.");
    }

    @Test
    public void combineOffencesCounts() {
        // Created Violations
        Violation violation1 = (new Detection(this.cars.get(9), "Den Helder",
                LocalDateTime.parse("2022-09-24T11:44:26"))).validatePurple();
        Violation violation2 = (new Detection(this.cars.get(9), "Amsterdam",
                LocalDateTime.parse("2022-09-24T11:44:26"))).validatePurple();
        Violation violation3 = (new Detection(this.cars.get(9), "Den Helder",
                LocalDateTime.parse("2022-09-24T11:44:26"))).validatePurple();

        // Combine
        assertNull(violation1.combineOffencesCounts(violation2).getCity(), "Different city should nullify.");
        assertNotNull(violation1.combineOffencesCounts(violation3).getCity(), "Same city should not nullify.");
        assertNull(violation1.combineOffencesCounts(violation1), "Cannot combine with itself.");
        assertEquals(2, violation1.combineOffencesCounts(violation2).getOffencesCount(), "Offences count should also combine.");
    }
}
