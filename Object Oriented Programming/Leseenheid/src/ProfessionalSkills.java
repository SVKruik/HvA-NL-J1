public class ProfessionalSkills extends Leseenheid {
    private boolean gehaald;

    public ProfessionalSkills(boolean gehaald, String naam, int ects, int studiejaar) {
        super(naam, ects, studiejaar);
        this.gehaald = gehaald;
    }

    public ProfessionalSkills(String naam, int ects, int studiejaar) {
        this(DEFAULT_GEHAALD, naam, ects, studiejaar);
    }

    public void setGehaald(boolean gehaald) {
        this.gehaald = gehaald;
    }

    public boolean isAfgerond() {
        return this.gehaald;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(super.toString());
        if (!this.gehaald) {
            sb.append(", niet gehaald");
        } else {
            sb.append(", gehaald");
        }

        return sb.toString();
    }
}
