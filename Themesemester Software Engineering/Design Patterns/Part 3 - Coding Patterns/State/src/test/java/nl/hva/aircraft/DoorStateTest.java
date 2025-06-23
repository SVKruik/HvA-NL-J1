package nl.hva.aircraft;

import nl.hva.state.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DoorStateTest {
    AircraftDoor aircraftDoor1;

    @BeforeEach
    void setup() {
        aircraftDoor1 = new AircraftDoor("Cabin Door 1");
    }

    @Test
    void initial_state_must_be_open() {
        assert (aircraftDoor1.getState() instanceof OpenState);
        assertEquals(Messages.OPEN_STATE_MESSAGE, aircraftDoor1.getState().toString());
    }

    @Test
    void initial_state_must_report_open() {
        assert (aircraftDoor1.getState() instanceof OpenState);
        assertEquals(Messages.OPEN_STATE_MESSAGE, aircraftDoor1.getState().toString());
    }

    @Test
    void closed_state_reports_correctly() {
        assertEquals(Messages.CLOSED_STATE_MESSAGE, aircraftDoor1.getClosedState().toString());
    }

    @Test
    void armed_state_reports_correctly() {
        assertEquals(Messages.ARMED_STATE_MESSAGE, aircraftDoor1.getArmedState().toString());
    }

    @Test
    void locked_state_reports_correctly() {
        assertEquals(Messages.LOCKED_STATE_MESSAGE, aircraftDoor1.getLockedState().toString());
    }

    @Test
    void deployed_state_reports_correctly() {
        assertEquals(Messages.SLIDE_DEPLOYED, aircraftDoor1.getDeployedState().toString());
    }

    /**
     * The door should only be able to move from open to closed to armed to locked.
     * Once locked it can only move from locked to armed (which is unlocked). In
     * normal circumstance, a door can then be moved from armed to closed (disarmed)
     * and then open. Opening an armed door is done in an emergency which deploys an
     * evacuation slide. A door in a nl.hva.state.SlideDeployedState cannot move to
     * any other state.
     */
    @Test
    void open_to_closed_sequence_correct() {
        assertEquals(Messages.CLOSED_STATE_MESSAGE, aircraftDoor1.closeDoor());
    }

    @Test
    void closed_to_armed_sequence_correct() {
        aircraftDoor1.closeDoor();
        assertEquals(Messages.ARMED_STATE_MESSAGE, aircraftDoor1.armDoor());
    }

    @Test
    void armed_to_locked_sequence_correct() {
        aircraftDoor1.closeDoor();
        aircraftDoor1.armDoor();

        assertEquals(Messages.LOCKED_STATE_MESSAGE, aircraftDoor1.lockDoor());
    }

    // Opening an armed door causes the emergency slide to be deployed. This is why
    // pilots give the instruction to the crew to disarm the doors when an aircraft
    // is near the airport gate.
    @Test
    void armed_deployed_sequence_correct() {
        aircraftDoor1.closeDoor();
        aircraftDoor1.armDoor();
        aircraftDoor1.openDoor();

        assert (aircraftDoor1.getState() instanceof SlideDeployedState);
    }

    @Test
    void locked_to_armed_sequence_correct() {
        aircraftDoor1.closeDoor();
        aircraftDoor1.armDoor();
        aircraftDoor1.lockDoor();
        aircraftDoor1.armDoor();
        assert (aircraftDoor1.getState() instanceof ArmedState);
    }

    @Test
    void armed_to_closed_sequence_correct() {
        aircraftDoor1.closeDoor();
        aircraftDoor1.armDoor();
        aircraftDoor1.lockDoor();
        aircraftDoor1.armDoor();
        aircraftDoor1.closeDoor();
        assert (aircraftDoor1.getState() instanceof ClosedState);
    }

    @Test
    void closed_to_open_sequence_correct() {
        aircraftDoor1.closeDoor();
        aircraftDoor1.armDoor();
        aircraftDoor1.lockDoor();
        aircraftDoor1.armDoor();
        aircraftDoor1.closeDoor();
        aircraftDoor1.openDoor();
        assert (aircraftDoor1.getState() instanceof OpenState);
    }

    @Test
    void open_cannot_be_opened() {
        assertEquals(Messages.DOOR_CANNOT_PERFORM_THIS_ACTION, aircraftDoor1.openDoor());
    }

    @Test
    void open_cannot_be_locked() {
        assertEquals(Messages.DOOR_CANNOT_PERFORM_THIS_ACTION, aircraftDoor1.lockDoor());
    }

    @Test
    void open_cannot_be_armed() {
        assertEquals(Messages.DOOR_CANNOT_PERFORM_THIS_ACTION, aircraftDoor1.armDoor());
    }

    @Test
    void closed_cannot_be_locked() {
        aircraftDoor1.closeDoor();

        assertEquals(Messages.DOOR_CANNOT_PERFORM_THIS_ACTION, aircraftDoor1.lockDoor());
    }

    @Test
    void locked_cannot_be_closed() {
        aircraftDoor1.closeDoor();
        aircraftDoor1.armDoor();
        aircraftDoor1.lockDoor();

        assertEquals(Messages.DOOR_CANNOT_PERFORM_THIS_ACTION, aircraftDoor1.closeDoor());

    }

    // Once a slide is deployed the door cannot move to any other state.
    @Test
    void deployed_slide_cannot_change_state() {
        aircraftDoor1.closeDoor();
        aircraftDoor1.armDoor();
        aircraftDoor1.openDoor();// triggers slide deployment

        assertEquals(Messages.DOOR_NEEDS_RESETTING, aircraftDoor1.closeDoor());
    }
}
