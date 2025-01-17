package models;

import java.time.LocalDateTime;
import java.util.List;

public class Detection {
    private final Car car;                  // the car that was detected
    private final String city;              // the name of the city where the detector was located
    private final LocalDateTime dateTime;   // date and time of the detection event

    /* Representation Invariant:
     *      every Detection shall be associated with a valid Car
     */

    public Detection(Car car, String city, LocalDateTime dateTime) {
        this.car = car;
        this.city = city;
        this.dateTime = dateTime;
    }

    /**
     * Parses detection information from a line of text about a car that has entered an environmentally controlled zone
     * of a specified city.
     * the format of the text line is: licensePlate, city, dateTime
     * The licensePlate shall be matched with a car from the provided list.
     * If no matching car can be found, a new Car shall be instantiated with the given licensePlate and added to the list
     * (besides the license plate number there will be no other information available about this car)
     *
     * @param textLine
     * @param cars     a list of known cars, ordered and searchable by licensePlate
     *                 (i.e. the indexOf method of the list shall only consider the licensePlate when comparing cars)
     * @return a new Detection instance with the provided information
     * or null if the textLine is corrupt or incomplete
     */
    public static Detection fromLine(String textLine, List<Car> cars) {
        // Setup
        if (textLine.isEmpty()) return null;
        String[] fields = textLine.split(",");
        if (fields.length != 3) return null;

        // Parsing Line
        String licensePlate = fields[0].trim();
        String city = fields[1].trim();
        LocalDateTime date = LocalDateTime.parse(fields[2].trim());

        // Handle
        Car car = new Car(licensePlate);
        int targetIndex = cars.indexOf(car);
        if (targetIndex == -1) {
            cars.add(car);
            targetIndex = cars.size() - 1;
        }
        return new Detection(cars.get(targetIndex), city, date);
    }

    /**
     * Validates a detection against the purple conditions for entering an environmentally restricted zone
     * I.e.:
     * Diesel trucks and diesel coaches with an emission category of below 6 may not enter a purple zone
     *
     * @return a Violation instance if the detection saw an offence against the purple zone rule/
     * null if no offence was found.
     */
    public Violation validatePurple() {
        Violation violation = null;

        // Check Vehicle Type
        if (this.car.getCarType().equals(Car.CarType.Coach) || this.car.getCarType().equals(Car.CarType.Truck)) {

            // Check Emission Threshold
            if (this.car.getEmissionCategory() < 6)
                violation = new Violation(this.car, this.city);
        } else return null;

        return violation;
    }

    public Car getCar() {
        return car;
    }

    public String getCity() {
        return city;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }


    @Override
    public String toString() {
        // Format: licensePlate/city/dateTime
        return this.car.getLicensePlate() + "/" + this.getCity() + "/" + this.getDateTime();
    }
}
