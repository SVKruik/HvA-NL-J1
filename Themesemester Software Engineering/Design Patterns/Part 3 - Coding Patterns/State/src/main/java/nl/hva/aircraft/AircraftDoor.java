package nl.hva.aircraft;

import nl.hva.state.*;

public class AircraftDoor {
    private final String id;

    final State openState, closedState, lockedState, armedState, slideDeployedState;

    State state;

    public AircraftDoor(String id) {
        this.id = id;

        this.openState = new OpenState(this);
        this.closedState = new ClosedState(this);
        this.lockedState = new LockedState(this);
        this.armedState = new ArmedState(this);
        this.slideDeployedState = new SlideDeployedState(this);

        this.state = this.openState;
    }

    public String openDoor() {
        return this.getState().openDoor();
    }

    public String closeDoor() {
        return this.getState().closeDoor();
    }

    public String armDoor() {
        return this.getState().armDoor();
    }

    public String lockDoor() {
        return this.getState().lockDoor();
    }

    public void setState(State state) {
        this.state = state;
    }

    public State getState() {
        return this.state;
    }

    public State getOpenState() {
        return this.openState;
    }

    public State getClosedState() {
        return this.closedState;
    }

    public State getLockedState() {
        return this.lockedState;
    }

    public State getArmedState() {
        return this.armedState;
    }

    public State getDeployedState() {
        return this.slideDeployedState;
    }

    public String toString() {
        StringBuilder status = new StringBuilder();
        status.append("\nnl.hva.aircraft.Aircraft Door: " + this.id);
        status.append("\n");
        status.append("nl.hva.state.State is " + this.getState() + "\n");
        return status.toString();
    }
}
