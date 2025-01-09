package models;

public class Violation {
    private final Car car;
    private final String city;
    private int offencesCount;

    public Violation(Car car, String city) {
        this.car = car;
        this.city = city;
        this.offencesCount = 1;
    }

    public static int compareByLicensePlateAndCity(Violation v1, Violation v2) {
        int licenseComparison = v1.getCar().getLicensePlate().compareTo(v2.getCar().getLicensePlate());
        if (licenseComparison == 0) return v1.getCity().compareTo(v2.getCity());
        return licenseComparison;
    }

    /**
     * Aggregates this violation with the other violation by adding their counts and
     * nullifying identifying attributes car and/or city that do not match
     * identifying attributes that match are retained in the result.
     * This method can be used for aggregating violations applying different grouping criteria
     *
     * @param other
     * @return a new violation with the accumulated offencesCount and matching identifying attributes.
     */
    public Violation combineOffencesCounts(Violation other) {
        if (other == this) return null;
        Violation combinedViolation = new Violation(
                // Nullify Car
                this.getCar() != null && this.getCar().equals(other.getCar()) ? this.car : null,
                // Nullify City
                this.getCity() != null && this.getCity().equals(other.getCity()) ? this.city : null);

        // Add both counts.
        combinedViolation.setOffencesCount(this.getOffencesCount() + other.getOffencesCount());
        return combinedViolation;
    }

    public Car getCar() {
        return car;
    }

    public String getCity() {
        return city;
    }

    public int getOffencesCount() {
        return offencesCount;
    }

    public void setOffencesCount(int offencesCount) {
        this.offencesCount = offencesCount;
    }

    @Override
    public String toString() {
        // Format: licensePlate/city/offencesCount
        return this.getCar().getLicensePlate() + "/" + this.getCity() + "/" + this.getOffencesCount();
    }
}
