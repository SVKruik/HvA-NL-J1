package nl.hva.components;

/**
 * This should be implemented to create specific types of cases
 */
public interface ComputerCase {
    /**
     * @return details of the ComputerCase in this format "Type Computer Case". An
     *         example might be "Gaming PC Case"
     */
    String getDetails();
}
