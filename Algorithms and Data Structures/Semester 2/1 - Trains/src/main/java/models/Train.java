package models;

public class Train {
    private final String origin;
    private final String destination;
    private final Locomotive engine;
    private Wagon firstWagon;

    /*
     * Representation invariants:
     * firstWagon == null || firstWagon.previousWagon == null
     * engine != null
     */

    public Train(Locomotive engine, String origin, String destination) {
        this.engine = engine;
        this.destination = destination;
        this.origin = origin;
    }

    /**
     * Indicates whether the train has at least one connected Wagon
     *
     * @return
     */
    public boolean hasWagons() {
        return firstWagon != null;
    }

    /**
     * A train is a passenger train when its first wagon is a PassengerWagon
     * (we do not worry about the posibility of mixed compositions here)
     *
     * @return If the train is a passenger train.
     */
    public boolean isPassengerTrain() {
        return this.getFirstWagon() instanceof PassengerWagon;
    }

    /**
     * A train is a freight train when its first wagon is a FreightWagon
     * (we do not worry about the posibility of mixed compositions here)
     *
     * @return If the train is a freight train.
     */
    public boolean isFreightTrain() {
        return this.getFirstWagon() instanceof FreightWagon;
    }

    public Locomotive getEngine() {
        return engine;
    }

    public Wagon getFirstWagon() {
        return firstWagon;
    }

    /**
     * Replaces the current sequence of wagons (if any) in the train
     * by the given new sequence of wagons (if any)
     *
     * @param wagon the first wagon of a sequence of wagons to be attached (can be
     *              null)
     */
    public void setFirstWagon(Wagon wagon) {
        this.firstWagon = wagon;
    }

    /**
     * @return the number of Wagons connected to the train
     */
    public int getNumberOfWagons() {
        if (!this.hasWagons())
            return 0;
        return this.getFirstWagon().getSequenceLength();
    }

    /**
     * @return the last wagon attached to the train
     */
    public Wagon getLastWagonAttached() {
        if (!this.hasWagons())
            return null;
        return this.getFirstWagon().getLastWagonAttached();
    }

    /**
     * @return the total number of seats on a passenger train
     * (return 0 for a freight train)
     */
    public int getTotalNumberOfSeats() {
        if (this.isFreightTrain())
            return 0;

        PassengerWagon current = (PassengerWagon) this.getFirstWagon();
        int totalNumberOfSeats = 0;
        while (current != null) {
            totalNumberOfSeats += current.getNumberOfSeats();
            current = (PassengerWagon) current.getNextWagon();
        }
        return totalNumberOfSeats;
    }

    /**
     * calculates the total maximum weight of a freight train
     *
     * @return the total maximum weight of a freight train
     * (return 0 for a passenger train)
     */
    public int getTotalMaxWeight() {
        if (this.isPassengerTrain())
            return 0;

        FreightWagon current = (FreightWagon) this.getFirstWagon();
        int totalNumberOfSeats = 0;
        while (current != null) {
            totalNumberOfSeats += current.getMaxWeight();
            current = (FreightWagon) current.getNextWagon();
        }
        return totalNumberOfSeats;
    }

    /**
     * Finds the wagon at the given position (starting at 0 for the first wagon of
     * the train)
     *
     * RELEVANT CODE USED IN REPORT
     *
     * @param position
     * @return the wagon found at the given position
     * (return null if the position is not valid for this train)
     */
    public Wagon findWagonAtPosition(int position) {
        if (position < 0)
            return null;
        if (!hasWagons())
            return null;
        if (position == 0)
            return this.getFirstWagon();

        Wagon current = this.getFirstWagon();
        int currentPosition = 0;

        while (current != null) {
            if (currentPosition == position)
                return current;
            current = current.getNextWagon();
            currentPosition++;
        }

        return current;
    }

    /**
     * Finds the wagon with a given wagonId
     *
     * @param wagonId
     * @return the wagon found
     * (return null if no wagon was found with the given wagonId)
     */
    public Wagon findWagonById(int wagonId) {
        if (this.hasWagons() && this.getFirstWagon().getId() == wagonId)
            return this.getFirstWagon();
        Wagon current = this.getFirstWagon();

        while (current != null) {
            if (current.getId() == wagonId)
                return current;
            current = current.getNextWagon();
        }

        return current;
    }

    /**
     * Determines if the given sequence of wagons can be attached to this train
     * Verifies if the type of wagons match the type of train (Passenger or Freight)
     * Verifies that the capacity of the engine is sufficient to also pull the
     * additional wagons
     * Verifies that the wagon is not part of the train already
     * Ignores the predecessors before the head wagon, if any
     *
     * RELEVANT CODE USED IN REPORT
     *
     * @param wagon the head wagon of a sequence of wagons to consider for
     *              attachment
     * @return whether type and capacity of this train can accommodate attachment of
     * the sequence
     */
    public boolean canAttach(Wagon wagon) {
        if (wagon == null)
            return false;
        int incomingWagons = wagon.getSequenceLength();

        // Type
        if (this.isPassengerTrain() && wagon instanceof FreightWagon && this.hasWagons())
            return false;
        if (this.isFreightTrain() && wagon instanceof PassengerWagon && this.hasWagons())
            return false;

        // Capacity
        if (this.getNumberOfWagons() + incomingWagons > this.getEngine().getMaxWagons())
            return false;

        // Already present
        Wagon current = this.getFirstWagon();
        while (current != null) {
            if (current == wagon)
                return false;
            current = current.getNextWagon();
        }

        return true;
    }

    /**
     * Tries to attach the given sequence of wagons to the rear of the train
     * No change is made if the attachment cannot be made.
     * (when the sequence is not compatible or the engine has insufficient capacity)
     * if attachment is possible, the head wagon is first detached from its
     * predecessors, if any
     *
     * @param wagon the head wagon of a sequence of wagons to be attached
     * @return whether the attachment could be completed successfully
     */
    public boolean attachToRear(Wagon wagon) {
        if (!canAttach(wagon))
            return false;
        wagon.detachFront();
        Wagon lastWagon = this.getLastWagonAttached();

        // Update links.
        if (lastWagon != null) {
            lastWagon.attachTail(wagon);

            // This setter was supplied with the starter project.
        } else
            this.insertAtFront(wagon);
        return true;
    }

    /**
     * Tries to insert the given sequence of wagons at the front of the train
     * (the front is at position one, before the current first wagon, if any)
     * No change is made if the insertion cannot be made.
     * (when the sequence is not compatible or the engine has insufficient capacity)
     * if insertion is possible, the head wagon is first detached from its
     * predecessors, if any
     *
     * RELEVANT CODE USED IN REPORT
     *
     * @param wagon the head wagon of a sequence of wagons to be inserted
     * @return whether the insertion could be completed successfully
     */
    public boolean insertAtFront(Wagon wagon) {
        if (!canAttach(wagon))
            return false;

        // No operation required.
        if (this.getFirstWagon() == wagon)
            return true;

        // Update Links.
        wagon.detachFront();
        Wagon previousFirstWagon = this.getFirstWagon();
        this.setFirstWagon(wagon);
        wagon.getLastWagonAttached().attachTail(previousFirstWagon);

        return true;
    }

    /**
     * Tries to insert the given sequence of wagons at/before the given position in
     * the train.
     * (The current wagon at given position including all its successors shall then
     * be reattached
     * after the last wagon of the given sequence.)
     * No change is made if the insertion cannot be made.
     * (when the sequence is not compatible or the engine has insufficient capacity
     * or the given position is not valid for insertion into this train)
     * if insertion is possible, the head wagon of the sequence is first detached
     * from its predecessors, if any
     *
     * RELEVANT CODE USED IN REPORT
     *
     * @param position the position where the head wagon and its successors shall be
     *                 inserted
     *                 0 <= position <= numWagons
     *                 (i.e. insertion immediately after the last wagon is also
     *                 possible)
     * @param wagon    the head wagon of a sequence of wagons to be inserted
     * @return whether the insertion could be completed successfully
     */
    public boolean insertAtPosition(int position, Wagon wagon) {
        // Validation
        if (position < 0)
            return false;
        if (!this.canAttach(wagon))
            return false;

        // Set first wagon
        if (position == 0 || !hasWagons()) {
            this.insertAtFront(wagon);
        } else if (position > this.getNumberOfWagons() - 1) {
            // Attach to last possible wagon.
            wagon.detachFront();
            this.attachToRear(wagon);
        } else {
            Wagon insertionWagon = this.findWagonAtPosition(position);

            if (insertionWagon == null) {
                this.getLastWagonAttached().attachTail(wagon);
            }

            Wagon previousWagon = insertionWagon.getPreviousWagon();
            if (insertionWagon.hasPreviousWagon()) {
                insertionWagon.detachFront();
                wagon.detachFront();
                previousWagon.attachTail(wagon);
                wagon.getLastWagonAttached().attachTail(insertionWagon);
            } else
                this.insertAtFront(wagon);
        }
        return true;
    }

    /**
     * Tries to remove one Wagon with the given wagonId from this train
     * and attach it at the rear of the given toTrain
     * No change is made if the removal or attachment cannot be made
     * (when the wagon cannot be found, or the trains are not compatible
     * or the engine of toTrain has insufficient capacity)
     *
     * RELEVANT CODE USED IN REPORT
     *
     * @param wagonId the id of the wagon to be removed
     * @param toTrain the train to which the wagon shall be attached
     *                toTrain shall be different from this train
     * @return whether the move could be completed successfully
     */
    public boolean moveOneWagon(int wagonId, Train toTrain) {
        Wagon wagon = this.findWagonById(wagonId);
        if (wagon == null || this == toTrain)
            return false;

        Wagon nextWagon = wagon.getNextWagon();
        if (!toTrain.canAttach(wagon))
            return false;
        wagon.removeFromSequence();

        if (this.getFirstWagon() == wagon)
            this.insertAtFront(nextWagon);

        toTrain.attachToRear(wagon);
        return true;
    }

    /**
     * Tries to split this train before the wagon at given position and move the
     * complete sequence
     * of wagons from the given position to the rear of toTrain.
     * No change is made if the split or re-attachment cannot be made
     * (when the position is not valid for this train, or the trains are not
     * compatible
     * or the engine of toTrain has insufficient capacity)
     *
     * @param position 0 <= position < numWagons
     * @param toTrain  the train to which the split sequence shall be attached
     *                 toTrain shall be different from this train
     * @return whether the move could be completed successfully
     */
    public boolean splitAtPosition(int position, Train toTrain) {
        if (!this.hasWagons())
            return false;
        Wagon splitWagon = this.findWagonAtPosition(position);
        if (!toTrain.canAttach(splitWagon))
            return false;
        if (position == 0)
            this.setFirstWagon(null);

        if (toTrain.getNumberOfWagons() > 0) {
            toTrain.attachToRear(splitWagon);
        } else
            toTrain.insertAtFront(splitWagon);

        return true;
    }

    /**
     * Reverses the sequence of wagons in this train (if any)
     * i.e. the last wagon becomes the first wagon
     * the previous wagon of the last wagon becomes the second wagon
     * etc.
     * (No change if the train has no wagons or only one wagon)
     */
    public void reverse() {
        if (!hasWagons()) return;
        Wagon wagon = this.getFirstWagon().reverseSequence();
        this.setFirstWagon(wagon);
    }

    @Override
    public String toString() {
        return "Train with engine " + engine + " rides from " + origin + " to " + destination + " and has first wagon: "
                + getFirstWagon();
    }
}
