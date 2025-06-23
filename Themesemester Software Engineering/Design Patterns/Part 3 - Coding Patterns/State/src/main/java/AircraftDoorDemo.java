import nl.hva.aircraft.Aircraft;

public class AircraftDoorDemo {

    public static void main(String args[]) {
        Aircraft aircraft = new Aircraft("VC10");

        // Normal flight
        printState(aircraft);
        aircraft.getCabinDoor1().closeDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().armDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().lockDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().armDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().closeDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().openDoor();
        printState(aircraft);

        // Emergency
        printState(aircraft);
        aircraft.getCabinDoor1().closeDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().armDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().lockDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().armDoor();
        printState(aircraft);
        aircraft.getCabinDoor1().openDoor();
        printState(aircraft);

    }

    public static void printState(Aircraft aircraft) {
        System.out.println(aircraft.toString());
    }
}
