package models;

import java.util.Objects;

public abstract class Wagon {
    protected int id;
    private Wagon nextWagon;
    private Wagon previousWagon;


    // representation invariant propositions:
    // tail-connection-invariant:   wagon.nextWagon == null or wagon == wagon.nextWagon.previousWagon
    // front-connection-invariant:  wagon.previousWagon == null or wagon = wagon.previousWagon.nextWagon

    public Wagon(int wagonId) {
        this.id = wagonId;
    }

    public int getId() {
        return id;
    }

    public Wagon getNextWagon() {
        return nextWagon;
    }

    public Wagon getPreviousWagon() {
        return previousWagon;
    }

    /**
     * @return whether this wagon has a wagon appended at the tail
     */
    public boolean hasNextWagon() {
        return this.getNextWagon() != null;
    }

    /**
     * @return whether this wagon has a wagon prepended at the front
     */
    public boolean hasPreviousWagon() {
        return this.getPreviousWagon() != null;
    }

    /**
     * Returns the last wagon attached to it,
     * if there are no wagons attached to it then this wagon is the last wagon.
     *
     * @return the last wagon
     */
    public Wagon getLastWagonAttached() {
        Wagon current = this;

        // Loop through the sequence.
        while (current.hasNextWagon()) {
            current = current.getNextWagon();
        }

        return current;
    }

    /**
     * @return the length of the sequence of wagons towards the end of its tail
     * including this wagon itself.
     */
    public int getSequenceLength() {
        Wagon current = this;
        int totalWagons = 1;

        // Loop through the sequence, while keeping track of the wagon count.
        while (current.hasNextWagon()) {
            current = current.getNextWagon();
            totalWagons++;
        }

        return totalWagons;
    }

    /**
     * Attaches the tail wagon and its connected successors behind this wagon,
     * if and only if this wagon has no wagon attached at its tail
     * and if the tail wagon has no wagon attached in front of it.
     *
     * @param tail the wagon to attach behind this wagon.
     * @throws IllegalStateException if this wagon already has a wagon appended to it.
     * @throws IllegalStateException if tail is already attached to a wagon in front of it.
     *                               The exception should include a message that reports the conflicting connection,
     *                               e.g.: "%s is already pulling %s"
     *                               or:   "%s has already been attached to %s"
     */
    public void attachTail(Wagon tail) {
        // No operation required.
        if (tail == null) return;

        // Check if this wagon has a tail.
        if (this.hasNextWagon()) {
            throw new IllegalStateException(String.format("%s is already pulling %s", this, this.getNextWagon()));
        }

        // Check if the incoming tail wagon is part of a sequence.
        if (tail.hasPreviousWagon()) {
            throw new IllegalStateException(String.format("%s has already been attached to %s", tail, tail.getPreviousWagon()));
        }

        // Update links.
        this.nextWagon = tail;
        tail.previousWagon = this;
    }

    /**
     * Detaches the tail from this wagon and returns the first wagon of this tail.
     *
     * @return the first wagon of the tail that has been detached
     * or <code>null</code> if it had no wagons attached to its tail.
     */
    public Wagon detachTail() {
        // No operation required.
        if (!this.hasNextWagon()) return null;

        // Update links.
        Wagon nextWagon = this.getNextWagon();
        this.getNextWagon().previousWagon = null;
        this.nextWagon = null;

        // Return the previous next wagon in the sequence.
        return nextWagon;
    }

    /**
     * Detaches this wagon from the wagon in front of it.
     * No action if this wagon has no previous wagon attached.
     *
     * @return the former previousWagon that has been detached from,
     * or <code>null</code> if it had no previousWagon.
     */
    public Wagon detachFront() {
        // No operation required.
        if (!hasPreviousWagon()) return null;

        // Update links.
        Wagon previousWagon = this.getPreviousWagon();
        if (this.getPreviousWagon() == null) return null;
        previousWagon.detachTail();

        // Return the previous, previous wagon in the sequence.
        return previousWagon;
    }

    /**
     * Replaces the tail of the <code>front</code> wagon by this wagon and its connected successors
     * Before such reconfiguration can be made,
     * the method first disconnects this wagon form its predecessor,
     * and the <code>front</code> wagon from its current tail.
     *
     * @param front the wagon to which this wagon must be attached to.
     */
    public void reAttachTo(Wagon front) {
        // Unlink wagon from the sequence and re-attach the next wagon to the previous wagon.
        front.detachTail();
        this.detachFront();
        front.attachTail(this);
    }

    /**
     * Removes this wagon from the sequence that it is part of,
     * and reconnects its tail to the wagon in front of it, if any.
     *
     * @return
     */
    public Wagon removeFromSequence() {
        Wagon previousWagon = this.getPreviousWagon();
        Wagon nextWagon = this.getNextWagon();

        // Unlink from sequence.
        this.detachFront();
        this.detachTail();

        // If this wagon is not the first wagon.
        if (nextWagon != null && previousWagon != null) {
            previousWagon.attachTail(nextWagon);
        }
        return previousWagon;
    }


    /**
     * Reverses the order in the sequence of wagons from this Wagon until its final successor.
     * The reversed sequence is attached again to the wagon in front of this Wagon, if any.
     * No action if this Wagon has no succeeding next wagon attached.
     *
     * @return the new start Wagon of the reversed sequence (with is the former last Wagon of the original sequence)
     */
    public Wagon reverseSequence() {
        Wagon current = this;
        Wagon previous = null;
        Wagon previousWagon = this.getPreviousWagon();

        while (current != null) {
            Wagon next = current.getNextWagon();
            current.detachFront();
            current.detachTail();

            if (previous != null) {
                current.attachTail(previous);
            }

            previous = current;
            current = next;
        }

        if (previousWagon != null) previousWagon.attachTail(previous);

        return previous;
    }

    @Override
    public String toString() {
        return "[Wagon-" + this.id + "]";
    }

    /**
     * Override the equals method to only check
     * for attributes and not memory tag.
     *
     * @param object Input wagon to compare.
     * @return If the wagon equals to this.
     */
    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null || getClass() != object.getClass()) return false;
        Wagon wagon = (Wagon) object;
        return id == wagon.id && Objects.equals(nextWagon, wagon.nextWagon) && Objects.equals(previousWagon, wagon.previousWagon);
    }
}
