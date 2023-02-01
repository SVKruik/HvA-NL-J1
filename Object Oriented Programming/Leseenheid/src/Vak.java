public class Vak extends Leseenheid {
    private double cijfer;

    public Vak(double cijfer, String naam, int ects, int studiejaar) {
        super(naam, ects, studiejaar);
        this.cijfer = cijfer;
    }

    public Vak(String naam, int ects, int studiejaar) {
        this(DEFAULT_CIJFER, naam, ects, studiejaar);
    }

    public void setCijfer(double cijfer) {
        this.cijfer = cijfer;
    }

    public boolean isAfgerond() {
        return !(this.cijfer < ONDERGRENS_VOLDOENDE);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(super.toString());
        sb.append(", cijfer ").append(this.cijfer);

        return sb.toString();
    }
}
