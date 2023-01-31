public class Vrijwilliger extends Persoon implements Oproepbaar {

    public Vrijwilliger(String naam) {
        super(naam);
    }

    @Override
    public double berekenInkomsten() {
        return 0;
    }

    @Override
    public void huurIn(int uren) {
        int urenGewerkt = uren;
    }
}
