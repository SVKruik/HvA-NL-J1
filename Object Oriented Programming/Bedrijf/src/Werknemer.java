public class Werknemer extends Persoon {
    private static int laatstePersoneelsnummer;
    private double maandSalaris;
    private int personeelsnummer;

    public Werknemer(double maandSalaris, String naam) {
        super(naam);
        this.maandSalaris = maandSalaris;
    }

    public double getMaandSalaris() {
        return maandSalaris;
    }

    @Override
    public double berekenInkomsten() {
        return this.maandSalaris;
    }
}
