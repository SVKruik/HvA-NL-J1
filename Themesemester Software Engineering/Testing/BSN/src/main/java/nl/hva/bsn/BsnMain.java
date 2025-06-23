package nl.hva.bsn;

import java.util.Scanner;

public class BsnMain {

    public static void main(String[] args) {
        BsnMain bsnMain = new BsnMain();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\nEnter a string to check if it is a valid BSN:");
            System.out.println(
                    "Type 'exit' to exit the program.\n");

            if (scanner.hasNextLine()) {
                String input = scanner.nextLine();

                if (input.equalsIgnoreCase("exit")) {
                    System.out.println("Exiting...");
                    break;
                } else {
                    BsnValidationMessage output = bsnMain.validate(input);
                    if (output == BsnValidationMessage.VALID) {
                        System.out.println("Valid BSN.");
                    } else
                        System.out.println("Invalid BSN. Error: " + output);
                }
            }
        }

        scanner.close();
    }

    /**
     * Validates a BSN.
     * 
     * @param bsn The BSN to validate.
     * @return A BsnValidationMessage indicating the result of the validation.
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
        boolean proof = elevenProof(bsn);
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
