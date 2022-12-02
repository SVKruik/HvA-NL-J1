public class Adres {
    private String straat;
    private int huisnummer;
    private String postcode;
    private String plaats;

    /**
     * @param straat - straat van student
     * @param huisnummer - huisnummer van student
     * @param postcode - postcode van student
     * @param plaats - plaats van student
     */
    public Adres(String straat, int huisnummer, String postcode, String plaats) {
        this.straat = straat;
        this.huisnummer = huisnummer;
        this.postcode = postcode;
        this.plaats = plaats;
    }

    public String toString() {
        return super.toString();
    }

    public String getPostcode() {
        return postcode;
    }

    public void setPostcode(String postcode) {
        this.postcode = postcode;


//    public boolean isGeldigePostcode(String postcode) {
//        boolean isGeldig = false;
//        boolean isGeldig1 = true;
//        boolean
//        if (Character.isDigit(postcode.charAt(0)) == true) {
//            if (postcode.charAt(0) <= 1 && postcode.charAt(0) >= 9 &&) {
//                isGeldig1 = false;
//            } else if (postcode.charAt(1) > -1 && postcode.charAt(0) < 9) {
//
//            }
//        } else {
//            isGeldig1 = false;
//        }
//
//
//
//        return isGeldig;
//    }
//
//}
    }}