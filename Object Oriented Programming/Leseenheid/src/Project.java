public class Project extends Leseenheid {
    private double productcijfer;
    private double procescijfer;
    private double methodenEnTechniekenCijfer;

    public Project(double productcijfer, double procescijfer, double methodenEnTechniekenCijfer, String naam, int ects, int studiejaar) {
        super(naam, ects, studiejaar);
        this.productcijfer = productcijfer;
        this.procescijfer = procescijfer;
        this.methodenEnTechniekenCijfer = methodenEnTechniekenCijfer;
    }

    public Project(String naam, int ects, int studiejaar) {
        this(DEFAULT_CIJFER, DEFAULT_CIJFER, DEFAULT_CIJFER, naam, ects, studiejaar);
    }

    public void setProductcijfer(double productcijfer) {
        this.productcijfer = productcijfer;
    }

    public void setProcescijfer(double procescijfer) {
        this.procescijfer = procescijfer;
    }

    public void setMethodenEnTechniekenCijfer(double methodenEnTechniekenCijfer) {
        this.methodenEnTechniekenCijfer = methodenEnTechniekenCijfer;
    }

    public boolean isAfgerond() {
        double minimaal_cijfer = 3 * ONDERGRENS_VOLDOENDE;
        double gehaald_cijfer = this.productcijfer + this.procescijfer + this.methodenEnTechniekenCijfer;
        return !(gehaald_cijfer < minimaal_cijfer);
    }


    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(super.toString()).append(" (");
        sb.append(this.productcijfer).append(", ");
        sb.append(this.procescijfer).append(", ");
        sb.append(this.methodenEnTechniekenCijfer).append(")");

        return sb.toString();
    }
}
