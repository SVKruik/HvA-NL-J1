package nl.hva.state;

public interface State {
    String lockDoor();

    String closeDoor();

    String openDoor();

    String armDoor();

    default String slideDeployed() {
        return Messages.DOOR_CANNOT_PERFORM_THIS_ACTION;
    }
}
