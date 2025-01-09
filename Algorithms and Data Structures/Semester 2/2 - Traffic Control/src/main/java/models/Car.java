package models;

import java.time.LocalDate;

public class Car implements Comparable<Car> {

    private final String licensePlate;      // defines the car uniquely
    private int emissionCategory;           // a number between 0 and 9, higher is cleaner, depends on type, fuel and age, typically.
    private CarType carType;
    private FuelType fuelType;
    private LocalDate dateOfAdmission;      // date of registration of the car at RDW

    public Car(String licensePlate) {
        // base constructor for unregistered and foreign cars
        this.licensePlate = licensePlate;
        this.emissionCategory = 0;
        this.carType = CarType.Unknown;
        this.fuelType = FuelType.Unknown;
        this.dateOfAdmission = LocalDate.EPOCH;
    }

    public Car(String licensePlate, int emissionCategory, CarType carType, FuelType fuelType, LocalDate dateOfAdmission) {
        this(licensePlate);
        this.emissionCategory = emissionCategory;
        this.carType = carType;
        this.fuelType = fuelType;
        this.dateOfAdmission = dateOfAdmission;
    }

    /**
     * parses car information from a textLine
     * with format: licensePlate, emissionCategory, carType, fuelType, dateOfAdmission
     * should ignore leading and trailing whitespaces in each field
     *
     * @param textLine
     * @return a new Car instance with the provided information
     * or null if the textLine is corrupt, incomplete or empty
     */
    public static Car fromLine(String textLine) {
        Car newCar = null;

        // Prepare Line
        String[] fields = textLine.split(",");
        if (fields.length >= 5) {
            try {
                // Parse & Instantiate
                newCar = new Car(
                        fields[0].trim(),
                        Integer.parseInt(fields[1].trim()),
                        CarType.valueOf(fields[2].trim()),
                        FuelType.valueOf(fields[3].trim()),
                        LocalDate.parse(fields[4].trim())
                );
            } catch (Exception e) {
                // Format Issue
                System.out.printf("Could not parse Car specification in text line '%s'\n", textLine);
                System.out.println(e.getMessage());
            }
        }

        return newCar;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public int getEmissionCategory() {
        return emissionCategory;
    }

    public void setEmissionCategory(int emissionCategory) {
        this.emissionCategory = emissionCategory;
    }

    public CarType getCarType() {
        return carType;
    }

    public void setCarType(CarType carType) {
        this.carType = carType;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public void setDateOfAdmission(LocalDate dateOfAdmission) {
        this.dateOfAdmission = dateOfAdmission;
    }

    public LocalDate getDateOfAdmission() {
        return dateOfAdmission;
    }

    @Override
    public int compareTo(Car other) {
        // Cars unique by license plate.
        return this.getLicensePlate().compareTo(other.getLicensePlate());
    }

    @Override
    public String toString() {
        return String.format("%s/%d/%s/%s",
                this.getLicensePlate(), this.getEmissionCategory(), this.getCarType(), this.getFuelType());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Car car)) return false;
        return licensePlate.equals(car.licensePlate);
    }

    @Override
    public int hashCode() {
        return licensePlate.hashCode();
    }

    public enum CarType {
        Unknown,
        Car,
        Van,
        Truck,
        Coach
    }

    public enum FuelType {
        Unknown,
        Gasoline,
        Lpg,
        Diesel,
        Electric
    }
}
