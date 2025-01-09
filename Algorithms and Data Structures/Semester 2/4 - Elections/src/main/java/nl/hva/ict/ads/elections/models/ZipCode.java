package nl.hva.ict.ads.elections.models;

public class ZipCode {
    public ZipCode() {
    }

    /**
     * Check whether a string is a valid zipcode.
     *
     * @param zipCode Input zipcode/string.
     * @return If the input string is invalid or not (true if invalid, false if valid).
     */
    public boolean isInvalidZipCode(String zipCode) {
        if (zipCode.length() != 6) return true;
        String numericPart = zipCode.substring(0, 4);
        String alphabeticPart = zipCode.substring(4);

        if (!numericPart.matches("\\d+")) return true;
        int numericValue = Integer.parseInt(numericPart);
        if (numericValue < 1000 || numericValue > 9999) return true;
        return !alphabeticPart.matches("[A-Z]{2}");
    }
}
