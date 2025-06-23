package nl.hva.components;

public interface Processor {
    /**
     * @return details of the Processor in this format "Type Processor". An example
     *         might be "Intel Basic Processor"
     */
    String getDetails();
}
