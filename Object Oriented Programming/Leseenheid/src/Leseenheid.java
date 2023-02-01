public class Leseenheid {
    private String naam;
    private int ects;
    private int studiejaar;

    static final int DEFAULT_CIJFER = -1;
    static final double ONDERGRENS_VOLDOENDE = 5.5;
    static final boolean DEFAULT_GEHAALD = false;

    public Leseenheid(String naam, int ects, int studiejaar) {
        this.naam = naam;
        this.ects = ects;
        this.studiejaar = studiejaar;
    }

    public String getNaam() {
        return naam;
    }

    public int getEcts() {
        return ects;
    }

    public int getStudiejaar() {
        return studiejaar;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.naam).append(", ").append(this.ects).append(" ects, studiejaar ").append(this.studiejaar);

        return sb.toString();
    }
}
