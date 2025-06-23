package nl.hva.aircraft;

public class Aircraft {
    private final AircraftDoor cabinDoor1;
    private final String type;

    public Aircraft(String type) {
        this.type = type;
        cabinDoor1 = new AircraftDoor("Cabin Door 1");
    }

    public AircraftDoor getCabinDoor1() {
        return cabinDoor1;
    }

    @Override
    public String toString() {
        return "nl.hva.aircraft.Aircraft: " + type + ": " + cabinDoor1;
    }
}
