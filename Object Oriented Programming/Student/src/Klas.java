public class Klas {
    public static final int MAX_AANTAL_STUDENTEN = 30;
    private String naam;
    private int aantalStudenten = MAX_AANTAL_STUDENTEN;
    private Student[] studenten = new Student[MAX_AANTAL_STUDENTEN];

    public Klas(String naam) {
        this.naam = naam;
    }

    public boolean voegStudentToe(Student student) {

    }

    public int getAantalStudenten() {
        return aantalStudenten;
    }

    public String toString() {
    }
}
