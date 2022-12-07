public class Adres {
    private String straat;
    private int huisnummer;
    private String postcode;
    private String plaats;

    /**
     * @param straat     - straat van student
     * @param huisnummer - huisnummer van student
     * @param postcode   - postcode van student
     * @param plaats     - plaats van student
     */
    public Adres(String straat, int huisnummer, String postcode, String plaats) {
        this.straat = straat;
        this.huisnummer = huisnummer;
        this.postcode = postcode;
        this.plaats = plaats;
    }

    public String toString() {
        return (straat + " " + huisnummer + ", " + postcode + " " + plaats);
    }


    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;
    }

    /**
     * Check met een regex of de postcode correct is.
     * @param postcode - input postcode te controleren
     * @return - geeft een boolean terug of de input postcode correct is.
     */
    public static boolean isGeldigePostcode(String postcode) {
        String regex = "^[1-9][0-9]{3}[A-Z]{2}$";
        return postcode.matches(regex);
    }
}