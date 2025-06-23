package nl.hva.state;

import nl.hva.aircraft.AircraftDoor;

public class LockedState implements State {
    AircraftDoor aircraftDoor;

    public LockedState(AircraftDoor aircraftDoor) {
        this.aircraftDoor = aircraftDoor;
    }

    @Override
    public String lockDoor() {
        return Messages.DOOR_CANNOT_PERFORM_THIS_ACTION;
    }

    @Override
    public String closeDoor() {
        return Messages.DOOR_CANNOT_PERFORM_THIS_ACTION;
    }

    @Override
    public String openDoor() {
        return Messages.DOOR_CANNOT_PERFORM_THIS_ACTION;
    }

    @Override
    public String armDoor() {
        this.aircraftDoor.setState(this.aircraftDoor.getArmedState());
        return Messages.ARMED_STATE_MESSAGE;
    }

    @Override
    public String toString() {
        return Messages.LOCKED_STATE_MESSAGE;
    }
}
