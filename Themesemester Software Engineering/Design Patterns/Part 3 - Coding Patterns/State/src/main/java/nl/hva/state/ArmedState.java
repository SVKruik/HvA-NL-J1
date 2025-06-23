package nl.hva.state;

import nl.hva.aircraft.AircraftDoor;

public class ArmedState implements State {
    AircraftDoor aircraftDoor;

    public ArmedState(AircraftDoor aircraftDoor) {
        this.aircraftDoor = aircraftDoor;
    }

    @Override
    public String lockDoor() {
        this.aircraftDoor.setState(this.aircraftDoor.getLockedState());
        return Messages.LOCKED_STATE_MESSAGE;
    }

    @Override
    public String closeDoor() {
        this.aircraftDoor.setState(this.aircraftDoor.getClosedState());
        return Messages.CLOSED_STATE_MESSAGE;
    }

    @Override
    public String openDoor() {
        this.aircraftDoor.setState(this.aircraftDoor.getDeployedState());
        return Messages.SLIDE_DEPLOYED;
    }

    @Override
    public String armDoor() {
        return Messages.DOOR_CANNOT_PERFORM_THIS_ACTION;
    }

    @Override
    public String toString() {
        return Messages.ARMED_STATE_MESSAGE;
    }
}
