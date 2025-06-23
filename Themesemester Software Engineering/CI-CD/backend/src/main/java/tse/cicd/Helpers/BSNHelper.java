package tse.cicd.Helpers;

import tse.cicd.Models.BsnValidationMessage;

/**
 * Helper class for validating a BSN.
 */
public class BSNHelper {
    /**
     * Validates a BSN.
     * 
     * @param bsn The BSN to validate.
     * @return The validation message.
     */
    public BsnValidationMessage validate(String bsn) {
        // Empty input
        if (bsn == null || bsn.trim().isEmpty())
            return BsnValidationMessage.EMPTY_INPUT;

        // Leading zero
        if (bsn.length() != 9)
            bsn = "0" + bsn;

        // Length
        if (bsn.length() != 9)
            return BsnValidationMessage.LENGTH;

        // Characters
        if (!bsn.matches("\\d+"))
            return BsnValidationMessage.INVALID_CHARACTERS;

        // Checksum
        boolean proof = this.elevenProof(bsn);
        if (Boolean.TRUE.equals(proof)) {
            return BsnValidationMessage.VALID;
        } else
            return BsnValidationMessage.INVALID_CHECKSUM;
    }

    /**
     * Validates a BSN using the eleven proof.
     * 
     * @param bsn The BSN to validate.
     * @return True if the BSN is valid, false if otherwise.
     */
    private boolean elevenProof(String bsn) {
        int[] weights = { 9, 8, 7, 6, 5, 4, 3, 2, -1 };
        int sum = 0;

        for (int i = 0; i < bsn.length(); i++) {
            int digit = Character.getNumericValue(bsn.charAt(i));
            sum += digit * weights[i];
        }

        return sum % 11 == 0;
    }
}
