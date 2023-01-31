public class Zzper extends Persoon implements Oproepbaar {
    private double uurtarief;
    private int urenGewerkt;

    public Zzper(double uurtarief, String naam) {
        super(naam);
        this.uurtarief = uurtarief;
    }

    @Override
    public double berekenInkomsten() {
        return urenGewerkt * uurtarief;
    }

    @Override
    public void huurIn(int uren) {
        this.urenGewerkt += uren;
    }
}
