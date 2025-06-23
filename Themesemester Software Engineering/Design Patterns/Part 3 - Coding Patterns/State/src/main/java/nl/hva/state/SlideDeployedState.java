package nl.hva.state;

import nl.hva.aircraft.AircraftDoor;

public class SlideDeployedState implements State {
    AircraftDoor aircraftDoor;

    public SlideDeployedState(AircraftDoor aircraftDoor) {
        this.aircraftDoor = aircraftDoor;
    }

    @Override
    public String lockDoor() {
        return slideDeployed();
    }

    @Override
    public String closeDoor() {
        return Messages.DOOR_NEEDS_RESETTING;
    }

    @Override
    public String openDoor() {
        return slideDeployed();
    }

    @Override
    public String armDoor() {
        return slideDeployed();
    }

    @Override
    public String toString() {
        return Messages.SLIDE_DEPLOYED;
    }
}
