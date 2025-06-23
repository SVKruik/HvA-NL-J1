package nl.hva.components;

/**
 * This should be implemented to create specific types of motherboards
 */
public interface MotherBoard {
    /**
     *
     * @return details of the MotherBoard in this format "Type Motherboard". An
     *         example might be "AMD Motherboard"
     */
    String getDetails();
}
