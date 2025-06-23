package nl.hva.bsn;

/**
 * Enum containing the possible validation messages for a BSN.
 */
public enum BsnValidationMessage {
    LENGTH("Length"),
    INVALID_CHECKSUM("Invalid Checksum"),
    INVALID_CHARACTERS("Invalid Characters"),
    EMPTY_INPUT("Empty Input"),
    VALID("Valid");

    final String message;

    BsnValidationMessage(String message) {
        this.message = message;
    }
}
